// Dashboard Data & Rendering Module
// Depends on: config.js, auth.js loaded first

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    setTimeout(() => {
      toast.classList.remove('toast--visible');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 2500);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard');
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied to clipboard');
    }
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function scoreClass(score) {
    if (score >= 8) return 'score--high';
    if (score >= 5) return 'score--mid';
    return 'score--low';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------

  async function getClientSupabase() {
    const clientId = await Auth.getClientId();
    return { sb: Auth.getClient(), clientId };
  }

  /**
   * Stats for today: totalLeads, avgFitScore, topRegion
   */
  async function fetchTodayStats() {
    const { sb, clientId } = await getClientSupabase();
    const today = todayISO();

    const { data, error } = await sb
      .from('leads')
      .select('id, fit_score, region')
      .eq('client_id', clientId)
      .gte('created_date', today)
      .lt('created_date', today + 'T23:59:59.999Z');

    if (error) throw error;

    const totalLeads = data.length;
    const avgFitScore = totalLeads > 0
      ? Math.round((data.reduce((s, l) => s + (l.fit_score || 0), 0) / totalLeads) * 10) / 10
      : 0;

    // Top region by count
    const regionCounts = {};
    data.forEach(l => {
      if (l.region) regionCounts[l.region] = (regionCounts[l.region] || 0) + 1;
    });
    const topRegion = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '--';

    return { totalLeads, avgFitScore, topRegion };
  }

  /**
   * Top leads by fit_score for today.
   */
  async function fetchTopLeads(limit = 5) {
    const { sb, clientId } = await getClientSupabase();
    const today = todayISO();

    const { data, error } = await sb
      .from('leads')
      .select('id, full_name, company, title, fit_score, region, email')
      .eq('client_id', clientId)
      .gte('created_date', today)
      .lt('created_date', today + 'T23:59:59.999Z')
      .order('fit_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Most recent briefing for this client.
   */
  async function fetchLatestBriefing() {
    const { sb, clientId } = await getClientSupabase();

    const { data, error } = await sb
      .from('briefings')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data || null;
  }

  /**
   * Filterable leads query with pagination.
   * filters: { region, icp_segment, dateFrom, dateTo, minFitScore, page, perPage }
   */
  async function fetchLeads(filters = {}) {
    const { sb, clientId } = await getClientSupabase();
    const page = filters.page || 1;
    const perPage = filters.perPage || 25;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = sb
      .from('leads')
      .select('id, full_name, company, title, fit_score, region, icp_segment, email, created_date', { count: 'exact' })
      .eq('client_id', clientId)
      .order('fit_score', { ascending: false })
      .range(from, to);

    if (filters.region) query = query.eq('region', filters.region);
    if (filters.icp_segment) query = query.eq('icp_segment', filters.icp_segment);
    if (filters.dateFrom) query = query.gte('created_date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_date', filters.dateTo + 'T23:59:59.999Z');
    if (filters.minFitScore) query = query.gte('fit_score', filters.minFitScore);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      leads: data || [],
      total: count || 0,
      page,
      perPage,
      totalPages: Math.ceil((count || 0) / perPage)
    };
  }

  /**
   * Single lead with outreach_package joined.
   */
  async function fetchLeadDetail(id) {
    const { sb, clientId } = await getClientSupabase();

    const { data, error } = await sb
      .from('leads')
      .select('*, outreach_packages(*)')
      .eq('client_id', clientId)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Paginated briefings list.
   */
  async function fetchBriefings(page = 1) {
    const { sb, clientId } = await getClientSupabase();
    const perPage = 10;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await sb
      .from('briefings')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      briefings: data || [],
      total: count || 0,
      page,
      perPage,
      totalPages: Math.ceil((count || 0) / perPage)
    };
  }

  /**
   * Download filtered leads as CSV.
   */
  async function exportLeadsCSV(filters = {}) {
    // Fetch all leads matching filters (no pagination)
    const { sb, clientId } = await getClientSupabase();

    let query = sb
      .from('leads')
      .select('full_name, company, title, email, fit_score, region, icp_segment, created_date')
      .eq('client_id', clientId)
      .order('fit_score', { ascending: false });

    if (filters.region) query = query.eq('region', filters.region);
    if (filters.icp_segment) query = query.eq('icp_segment', filters.icp_segment);
    if (filters.dateFrom) query = query.gte('created_date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_date', filters.dateTo + 'T23:59:59.999Z');
    if (filters.minFitScore) query = query.gte('fit_score', filters.minFitScore);

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      showToast('No leads to export');
      return;
    }

    const headers = ['Name', 'Company', 'Title', 'Email', 'Fit Score', 'Region', 'ICP Segment', 'Date'];
    const rows = data.map(l => [
      l.full_name,
      l.company,
      l.title,
      l.email,
      l.fit_score,
      l.region,
      l.icp_segment,
      l.created_date
    ].map(v => '"' + String(v || '').replace(/"/g, '""') + '"').join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-' + todayISO() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded');
  }

  // ---------------------------------------------------------------------------
  // Rendering — Dashboard
  // ---------------------------------------------------------------------------

  async function renderDashboard() {
    const session = await Auth.initAuth();
    if (!session) return;

    try {
      const [stats, topLeads, briefing] = await Promise.all([
        fetchTodayStats(),
        fetchTopLeads(5),
        fetchLatestBriefing()
      ]);

      // Stats cards
      const statsEl = document.getElementById('stats-grid');
      if (statsEl) {
        statsEl.innerHTML = `
          <div class="stat-card">
            <div class="stat-card__value">${stats.totalLeads}</div>
            <div class="stat-card__label">Today's Leads</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${stats.avgFitScore}</div>
            <div class="stat-card__label">Avg Fit Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${escapeHtml(stats.topRegion)}</div>
            <div class="stat-card__label">Top Region</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${topLeads.length}</div>
            <div class="stat-card__label">Hot Leads</div>
          </div>
        `;
      }

      // Top leads
      const leadsEl = document.getElementById('top-leads');
      if (leadsEl) {
        if (topLeads.length === 0) {
          leadsEl.innerHTML = '<p class="empty-state">No leads generated today yet.</p>';
        } else {
          leadsEl.innerHTML = topLeads.map(lead => `
            <a href="lead.html?id=${lead.id}" class="lead-card">
              <div class="lead-card__header">
                <div class="lead-card__name">${escapeHtml(lead.full_name)}</div>
                <span class="score-badge ${scoreClass(lead.fit_score)}">${lead.fit_score}</span>
              </div>
              <div class="lead-card__meta">
                <span>${escapeHtml(lead.company || '')}</span>
                ${lead.title ? '<span class="dot-sep"></span><span>' + escapeHtml(lead.title) + '</span>' : ''}
              </div>
              <div class="lead-card__footer">
                <span class="region-tag">${escapeHtml(lead.region || '')}</span>
                ${lead.email ? '<button class="btn-copy" onclick="event.preventDefault();App.copyToClipboard(\'' + escapeHtml(lead.email) + '\')">Copy Email</button>' : ''}
              </div>
            </a>
          `).join('');
        }
      }

      // Latest briefing
      const briefingEl = document.getElementById('latest-briefing');
      if (briefingEl && briefing) {
        briefingEl.innerHTML = `
          <div class="briefing-card briefing-card--expanded">
            <div class="briefing-card__header">
              <span class="briefing-card__date">${formatDate(briefing.created_at)}</span>
            </div>
            <div class="briefing-card__content">${briefing.content_html || escapeHtml(briefing.content || '')}</div>
          </div>
        `;
      } else if (briefingEl) {
        briefingEl.innerHTML = '<p class="empty-state">No briefings yet.</p>';
      }

    } catch (err) {
      console.error('Dashboard render error:', err);
      showToast('Error loading dashboard data');
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering — Leads Table
  // ---------------------------------------------------------------------------

  let _currentFilters = { page: 1 };

  async function renderLeadsTable() {
    const session = await Auth.initAuth();
    if (!session) return;

    // Bind filter controls
    bindFilters();
    await loadLeads();
  }

  function bindFilters() {
    const form = document.getElementById('leads-filters');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      _currentFilters.page = 1;
      readFiltersFromForm();
      await loadLeads();
    });

    const resetBtn = document.getElementById('filters-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        document.getElementById('leads-filters').reset();
        _currentFilters = { page: 1 };
        await loadLeads();
      });
    }

    const exportBtn = document.getElementById('export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        readFiltersFromForm();
        exportLeadsCSV(_currentFilters);
      });
    }
  }

  function readFiltersFromForm() {
    const form = document.getElementById('leads-filters');
    if (!form) return;
    const fd = new FormData(form);
    if (fd.get('region')) _currentFilters.region = fd.get('region');
    else delete _currentFilters.region;
    if (fd.get('icp_segment')) _currentFilters.icp_segment = fd.get('icp_segment');
    else delete _currentFilters.icp_segment;
    if (fd.get('dateFrom')) _currentFilters.dateFrom = fd.get('dateFrom');
    else delete _currentFilters.dateFrom;
    if (fd.get('dateTo')) _currentFilters.dateTo = fd.get('dateTo');
    else delete _currentFilters.dateTo;
    if (fd.get('minFitScore')) _currentFilters.minFitScore = parseInt(fd.get('minFitScore'), 10);
    else delete _currentFilters.minFitScore;
  }

  async function loadLeads() {
    const tableBody = document.getElementById('leads-table-body');
    const paginationEl = document.getElementById('leads-pagination');
    if (!tableBody) return;

    try {
      const result = await fetchLeads(_currentFilters);

      if (result.leads.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No leads match your filters.</td></tr>';
      } else {
        tableBody.innerHTML = result.leads.map(lead => `
          <tr onclick="window.location.href='lead.html?id=${lead.id}'">
            <td>${escapeHtml(lead.full_name)}</td>
            <td>${escapeHtml(lead.company || '')}</td>
            <td>${escapeHtml(lead.title || '')}</td>
            <td><span class="score-badge ${scoreClass(lead.fit_score)}">${lead.fit_score}</span></td>
            <td><span class="region-tag">${escapeHtml(lead.region || '')}</span></td>
            <td>${escapeHtml(lead.icp_segment || '')}</td>
            <td>${formatDate(lead.created_date)}</td>
          </tr>
        `).join('');
      }

      // Render pagination
      if (paginationEl) {
        paginationEl.innerHTML = `
          <button class="btn-page" ${result.page <= 1 ? 'disabled' : ''} data-page="${result.page - 1}">Prev</button>
          <span class="page-indicator">Page ${result.page} of ${result.totalPages || 1}</span>
          <button class="btn-page" ${result.page >= result.totalPages ? 'disabled' : ''} data-page="${result.page + 1}">Next</button>
        `;
        paginationEl.querySelectorAll('.btn-page').forEach(btn => {
          btn.addEventListener('click', async () => {
            const pg = parseInt(btn.dataset.page, 10);
            if (pg >= 1) {
              _currentFilters.page = pg;
              await loadLeads();
            }
          });
        });
      }

      // Mobile: add card layout data attrs
      tableBody.querySelectorAll('tr').forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells[0]) cells[0].setAttribute('data-label', 'Name');
        if (cells[1]) cells[1].setAttribute('data-label', 'Company');
        if (cells[2]) cells[2].setAttribute('data-label', 'Title');
        if (cells[3]) cells[3].setAttribute('data-label', 'Fit Score');
        if (cells[4]) cells[4].setAttribute('data-label', 'Region');
        if (cells[5]) cells[5].setAttribute('data-label', 'ICP Segment');
        if (cells[6]) cells[6].setAttribute('data-label', 'Date');
      });

    } catch (err) {
      console.error('Leads load error:', err);
      showToast('Error loading leads');
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering — Lead Detail
  // ---------------------------------------------------------------------------

  async function renderLeadDetail() {
    const session = await Auth.initAuth();
    if (!session) return;

    const id = getUrlParam('id');
    if (!id) {
      window.location.href = 'leads.html';
      return;
    }

    const container = document.getElementById('lead-detail');
    if (!container) return;

    try {
      const lead = await fetchLeadDetail(id);
      const outreach = lead.outreach_packages?.[0] || lead.outreach_packages || null;

      container.innerHTML = `
        <div class="detail-header">
          <div>
            <h1 class="detail-name">${escapeHtml(lead.full_name)}</h1>
            <p class="detail-meta">
              ${escapeHtml(lead.title || '')}${lead.title && lead.company ? ' at ' : ''}${escapeHtml(lead.company || '')}
            </p>
          </div>
          <span class="score-badge score-badge--lg ${scoreClass(lead.fit_score)}">${lead.fit_score}</span>
        </div>

        <div class="detail-tags">
          <span class="region-tag">${escapeHtml(lead.region || '')}</span>
          ${lead.icp_segment ? '<span class="icp-tag">' + escapeHtml(lead.icp_segment) + '</span>' : ''}
          <span class="date-tag">${formatDate(lead.created_date)}</span>
        </div>

        ${lead.email ? `
        <div class="detail-section">
          <div class="detail-section__header">Contact</div>
          <div class="detail-row">
            <span>${escapeHtml(lead.email)}</span>
            <button class="btn-copy" onclick="App.copyToClipboard('${escapeHtml(lead.email)}')">Copy</button>
          </div>
          ${lead.phone ? '<div class="detail-row"><span>' + escapeHtml(lead.phone) + '</span></div>' : ''}
          ${lead.linkedin_url ? '<div class="detail-row"><a href="' + escapeHtml(lead.linkedin_url) + '" target="_blank" rel="noopener">LinkedIn Profile</a></div>' : ''}
        </div>
        ` : ''}

        ${lead.prospect_brief ? `
        <div class="detail-section">
          <div class="detail-section__header">Prospect Brief</div>
          <div class="detail-section__body">${escapeHtml(lead.prospect_brief)}</div>
        </div>
        ` : ''}

        ${outreach ? renderOutreach(outreach) : ''}
      `;
    } catch (err) {
      console.error('Lead detail error:', err);
      container.innerHTML = '<p class="empty-state">Lead not found.</p>';
    }
  }

  function renderOutreach(pkg) {
    let html = '';

    if (pkg.email_subject && pkg.email_body) {
      html += `
        <div class="detail-section">
          <div class="detail-section__header">
            Cold Email
            <button class="btn-copy" onclick="App.copyToClipboard(document.getElementById('email-block').innerText)">Copy</button>
          </div>
          <div id="email-block" class="detail-section__body outreach-block">
            <div class="outreach-subject"><strong>Subject:</strong> ${escapeHtml(pkg.email_subject)}</div>
            <div class="outreach-body">${escapeHtml(pkg.email_body)}</div>
          </div>
        </div>
      `;
    }

    if (pkg.followup_1 || pkg.followup_2 || pkg.followup_3) {
      html += `
        <div class="detail-section">
          <div class="detail-section__header collapsible" onclick="this.parentElement.classList.toggle('detail-section--collapsed')">
            Follow-up Sequence
            <span class="collapse-icon"></span>
          </div>
          <div class="detail-section__body">
            ${pkg.followup_1 ? '<div class="followup-block"><div class="followup-label">Follow-up 1</div><div class="outreach-body">' + escapeHtml(pkg.followup_1) + '</div><button class="btn-copy" onclick="App.copyToClipboard(\'' + escapeHtml(pkg.followup_1).replace(/'/g, "\\'") + '\')">Copy</button></div>' : ''}
            ${pkg.followup_2 ? '<div class="followup-block"><div class="followup-label">Follow-up 2</div><div class="outreach-body">' + escapeHtml(pkg.followup_2) + '</div><button class="btn-copy" onclick="App.copyToClipboard(\'' + escapeHtml(pkg.followup_2).replace(/'/g, "\\'") + '\')">Copy</button></div>' : ''}
            ${pkg.followup_3 ? '<div class="followup-block"><div class="followup-label">Follow-up 3</div><div class="outreach-body">' + escapeHtml(pkg.followup_3) + '</div><button class="btn-copy" onclick="App.copyToClipboard(\'' + escapeHtml(pkg.followup_3).replace(/'/g, "\\'") + '\')">Copy</button></div>' : ''}
          </div>
        </div>
      `;
    }

    if (pkg.sales_script) {
      html += `
        <div class="detail-section">
          <div class="detail-section__header">
            Sales Script
            <button class="btn-copy" onclick="App.copyToClipboard(document.getElementById('script-block').innerText)">Copy</button>
          </div>
          <div id="script-block" class="detail-section__body outreach-block">${escapeHtml(pkg.sales_script)}</div>
        </div>
      `;
    }

    return html;
  }

  // ---------------------------------------------------------------------------
  // Rendering — Briefings
  // ---------------------------------------------------------------------------

  let _briefingPage = 1;

  async function renderBriefings() {
    const session = await Auth.initAuth();
    if (!session) return;

    await loadBriefings();
  }

  async function loadBriefings() {
    const container = document.getElementById('briefings-list');
    const paginationEl = document.getElementById('briefings-pagination');
    if (!container) return;

    try {
      const result = await fetchBriefings(_briefingPage);

      if (result.briefings.length === 0) {
        container.innerHTML = '<p class="empty-state">No briefings yet.</p>';
      } else {
        container.innerHTML = result.briefings.map(b => `
          <div class="briefing-card">
            <div class="briefing-card__header" onclick="this.parentElement.classList.toggle('briefing-card--expanded')">
              <span class="briefing-card__date">${formatDate(b.created_at)}</span>
              ${b.title ? '<span class="briefing-card__title">' + escapeHtml(b.title) + '</span>' : ''}
              <span class="collapse-icon"></span>
            </div>
            <div class="briefing-card__content">${b.content_html || escapeHtml(b.content || '')}</div>
          </div>
        `).join('');
      }

      if (paginationEl) {
        paginationEl.innerHTML = `
          <button class="btn-page" ${result.page <= 1 ? 'disabled' : ''} data-page="${result.page - 1}">Prev</button>
          <span class="page-indicator">Page ${result.page} of ${result.totalPages || 1}</span>
          <button class="btn-page" ${result.page >= result.totalPages ? 'disabled' : ''} data-page="${result.page + 1}">Next</button>
        `;
        paginationEl.querySelectorAll('.btn-page').forEach(btn => {
          btn.addEventListener('click', async () => {
            const pg = parseInt(btn.dataset.page, 10);
            if (pg >= 1) {
              _briefingPage = pg;
              await loadBriefings();
            }
          });
        });
      }
    } catch (err) {
      console.error('Briefings load error:', err);
      showToast('Error loading briefings');
    }
  }

  // ---------------------------------------------------------------------------
  // Expose public API
  // ---------------------------------------------------------------------------

  window.App = {
    // Rendering (page entry points)
    renderDashboard,
    renderLeadsTable,
    renderLeadDetail,
    renderBriefings,

    // Data (for advanced use)
    fetchTodayStats,
    fetchTopLeads,
    fetchLatestBriefing,
    fetchLeads,
    fetchLeadDetail,
    fetchBriefings,
    exportLeadsCSV,

    // Helpers
    copyToClipboard,
    formatDate,
    showToast,
    getUrlParam
  };
})();
