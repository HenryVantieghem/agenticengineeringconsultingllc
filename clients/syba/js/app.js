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

  function escapeAttr(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function fullName(obj) {
    return [(obj.first_name || ''), (obj.last_name || '')].filter(Boolean).join(' ') || 'Unknown';
  }

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------

  async function getClientSupabase() {
    const clientId = await Auth.getClientId();
    return { sb: Auth.getClient(), clientId };
  }

  /**
   * Stats: totalLeads, avgFitScore, topRegion, outreachCount, briefingCount
   * Shows ALL leads (not just today's) so data persists across days.
   */
  async function fetchTodayStats() {
    const { sb, clientId } = await getClientSupabase();

    // Fetch leads and outreach count in parallel
    const [leadsResult, outreachResult, briefingsResult, eventsResult] = await Promise.all([
      sb.from('leads').select('id, fit_score, region, icp_segment').eq('client_id', clientId),
      sb.from('outreach_packages').select('id', { count: 'exact', head: true }),
      sb.from('briefings').select('id', { count: 'exact', head: true }).eq('client_id', clientId),
      sb.from('trigger_events').select('id, event_summary, icp_segment, urgency_score, email_hook').eq('client_id', clientId).order('urgency_score', { ascending: false }).limit(5)
    ]);

    if (leadsResult.error) throw leadsResult.error;
    const data = leadsResult.data;

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

    // ICP breakdown
    const icpCounts = {};
    data.forEach(l => {
      if (l.icp_segment) icpCounts[l.icp_segment] = (icpCounts[l.icp_segment] || 0) + 1;
    });

    return {
      totalLeads,
      avgFitScore,
      topRegion,
      regionCounts,
      icpCounts,
      outreachCount: outreachResult.count || 0,
      briefingCount: briefingsResult.count || 0,
      triggerEvents: eventsResult.data || []
    };
  }

  /**
   * Top leads by fit_score (all time, not just today).
   */
  async function fetchTopLeads(limit = 5) {
    const { sb, clientId } = await getClientSupabase();

    const { data, error } = await sb
      .from('leads')
      .select('id, first_name, last_name, company, title, fit_score, region, email, icp_segment')
      .eq('client_id', clientId)
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
      .select('id, first_name, last_name, company, title, fit_score, region, icp_segment, email, created_date, email_verified, email_verification_source, contact_status, contacted_at, follow_up_stage, notes, linkedin_post_hook', { count: 'exact' })
      .eq('client_id', clientId)
      .order('fit_score', { ascending: false })
      .range(from, to);

    if (filters.region) query = query.eq('region', filters.region);
    if (filters.icp_segment) query = query.eq('icp_segment', filters.icp_segment);
    if (filters.dateFrom) query = query.gte('created_date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_date', filters.dateTo);
    if (filters.minFitScore) query = query.gte('fit_score', filters.minFitScore);
    if (filters.contact_status) query = query.eq('contact_status', filters.contact_status);

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
   * Update a lead's contact status in Supabase.
   */
  async function updateLeadStatus(leadId, newStatus) {
    const { sb } = await getClientSupabase();
    const updateData = { contact_status: newStatus };

    // Set contacted_at on first status change from pending
    if (newStatus === 'contacted') {
      updateData.contacted_at = new Date().toISOString();
    }

    const { error } = await sb
      .from('leads')
      .update(updateData)
      .eq('id', leadId);

    if (error) throw error;
    showToast('Status updated to ' + newStatus);
  }

  /**
   * Update a lead's follow-up stage.
   */
  async function updateFollowUpStage(leadId, stage) {
    const { sb } = await getClientSupabase();
    const { error } = await sb
      .from('leads')
      .update({ follow_up_stage: stage })
      .eq('id', leadId);

    if (error) throw error;
  }

  /**
   * Update a lead's notes.
   */
  async function updateLeadNotes(leadId, notes) {
    const { sb } = await getClientSupabase();
    const { error } = await sb
      .from('leads')
      .update({ notes: notes })
      .eq('id', leadId);

    if (error) throw error;
    showToast('Notes saved');
  }

  /**
   * Calculate follow-up due badge text.
   */
  function getFollowUpBadge(lead) {
    if (!lead.contacted_at || lead.contact_status !== 'contacted') return '';
    const contactedDate = new Date(lead.contacted_at);
    const now = new Date();
    const daysSince = Math.floor((now - contactedDate) / (1000 * 60 * 60 * 24));
    const stage = lead.follow_up_stage || 'initial';

    if (stage === 'initial' && daysSince >= 3) return 'FU1 due';
    if (stage === 'fu1_sent' && daysSince >= 10) return 'FU2 due';
    if (stage === 'fu2_sent' && daysSince >= 17) return 'FU3 due';
    return '';
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
      .select('first_name, last_name, company, title, email, fit_score, email_verified, contact_status, region, icp_segment, created_date, notes')
      .eq('client_id', clientId)
      .order('fit_score', { ascending: false });

    if (filters.region) query = query.eq('region', filters.region);
    if (filters.icp_segment) query = query.eq('icp_segment', filters.icp_segment);
    if (filters.dateFrom) query = query.gte('created_date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_date', filters.dateTo);
    if (filters.minFitScore) query = query.gte('fit_score', filters.minFitScore);

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      showToast('No leads to export');
      return;
    }

    const headers = ['Name', 'Company', 'Title', 'Email', 'Fit Score', 'Verified', 'Status', 'Region', 'ICP Segment', 'Date', 'Notes'];
    const rows = data.map(l => [
      fullName(l),
      l.company,
      l.title,
      l.email,
      l.fit_score,
      l.email_verified ? 'Yes' : 'No',
      l.contact_status || 'pending',
      l.region,
      l.icp_segment,
      l.created_date,
      l.notes || ''
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

      renderStatsCards(stats, topLeads);
      renderTopLeadsCards(topLeads);
      renderBriefingCard(briefing);

      // Start listening for realtime updates
      setupDashboardRealtime();

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

    // Start listening for realtime updates
    setupLeadsRealtime();
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
        // Also reset status filter
        document.querySelectorAll('.btn-status-filter').forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.btn-status-filter[data-status=""]');
        if (allBtn) allBtn.classList.add('active');
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

    // Status filter buttons
    document.querySelectorAll('.btn-status-filter').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('.btn-status-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const status = btn.dataset.status;
        if (status) {
          _currentFilters.contact_status = status;
        } else {
          delete _currentFilters.contact_status;
        }
        _currentFilters.page = 1;
        await loadLeads();
      });
    });

    // Notes modal close/cancel
    const notesModal = document.getElementById('notesModal');
    const notesClose = document.getElementById('notesModalClose');
    const notesCancel = document.getElementById('notesCancel');
    if (notesClose) notesClose.addEventListener('click', () => { notesModal.hidden = true; });
    if (notesCancel) notesCancel.addEventListener('click', () => { notesModal.hidden = true; });
    if (notesModal) {
      notesModal.addEventListener('click', (e) => {
        if (e.target === notesModal) notesModal.hidden = true;
      });
    }

    // Notes save
    const notesSave = document.getElementById('notesSave');
    if (notesSave) {
      notesSave.addEventListener('click', async () => {
        const leadId = notesModal.dataset.leadId;
        const notes = document.getElementById('notesTextarea').value;
        try {
          await updateLeadNotes(leadId, notes);
          notesModal.hidden = true;
          await loadLeads();
        } catch (err) {
          console.error('Notes save error:', err);
          showToast('Error saving notes');
        }
      });
    }
  }

  /**
   * Open notes modal for a lead.
   */
  function openNotesModal(leadId, leadName, currentNotes) {
    const modal = document.getElementById('notesModal');
    const title = document.getElementById('notesModalTitle');
    const textarea = document.getElementById('notesTextarea');
    if (!modal) return;
    modal.dataset.leadId = leadId;
    title.textContent = 'Notes — ' + leadName;
    textarea.value = currentNotes || '';
    modal.hidden = false;
    textarea.focus();
  }

  /**
   * Handle status dropdown change in the leads table.
   */
  async function handleStatusChange(selectEl) {
    const leadId = selectEl.dataset.leadId;
    const newStatus = selectEl.value;
    try {
      await updateLeadStatus(leadId, newStatus);
      // Update the select styling
      selectEl.className = 'status-select status--' + newStatus;
    } catch (err) {
      console.error('Status update error:', err);
      showToast('Error updating status');
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

      const badge = document.getElementById('leadCountBadge');
      if (badge) badge.textContent = result.total + ' leads';

      if (result.leads.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="empty-state">No leads match your filters.</td></tr>';
      } else {
        tableBody.innerHTML = result.leads.map(lead => {
          const verified = lead.email_verified;
          const verifiedClass = verified === true ? 'valid' : verified === false ? 'invalid' : 'unknown';
          const verifiedIcon = verified === true ? '&#10003;' : verified === false ? '&#10007;' : '?';
          const verifiedTitle = verified === true ? 'Verified' : verified === false ? 'Not verified' : 'Unknown';
          const status = lead.contact_status || 'pending';
          const fuBadge = getFollowUpBadge(lead);
          const hasNotes = lead.notes && lead.notes.trim().length > 0;

          return `
          <tr>
            <td>
              <a class="lead-name-link" href="lead.html?id=${lead.id}">${escapeHtml(fullName(lead))}</a>
              ${fuBadge ? '<span class="fu-badge">' + fuBadge + '</span>' : ''}
              <button class="btn-notes ${hasNotes ? 'has-notes' : ''}" data-lead-id="${escapeAttr(lead.id)}" data-lead-name="${escapeAttr(fullName(lead))}" data-notes="${escapeAttr(lead.notes || '')}" title="${hasNotes ? 'Edit notes' : 'Add notes'}">&#9998;</button>
            </td>
            <td>${escapeHtml(lead.company || '')}</td>
            <td>${escapeHtml(lead.title || '')}</td>
            <td><span class="score-badge ${scoreClass(lead.fit_score)}">${lead.fit_score}</span></td>
            <td><span class="verified-badge ${verifiedClass}" title="${verifiedTitle}">${verifiedIcon}</span></td>
            <td>
              <select class="status-select status--${status}" data-lead-id="${lead.id}" onchange="App.handleStatusChange(this)">
                <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="contacted" ${status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="replied" ${status === 'replied' ? 'selected' : ''}>Replied</option>
                <option value="meeting_booked" ${status === 'meeting_booked' ? 'selected' : ''}>Booked</option>
                <option value="bounced" ${status === 'bounced' ? 'selected' : ''}>Bounced</option>
              </select>
            </td>
            <td><span class="region-tag">${escapeHtml(lead.region || '')}</span></td>
            <td>${escapeHtml(lead.icp_segment || '')}</td>
            <td>${formatDate(lead.created_date)}</td>
          </tr>`;
        }).join('');

        // Bind notes buttons
        tableBody.querySelectorAll('.btn-notes').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openNotesModal(btn.dataset.leadId, btn.dataset.leadName, btn.dataset.notes);
          });
        });
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
        if (cells[3]) cells[3].setAttribute('data-label', 'Fit');
        if (cells[4]) cells[4].setAttribute('data-label', 'Verified');
        if (cells[5]) cells[5].setAttribute('data-label', 'Status');
        if (cells[6]) cells[6].setAttribute('data-label', 'Region');
        if (cells[7]) cells[7].setAttribute('data-label', 'ICP Segment');
        if (cells[8]) cells[8].setAttribute('data-label', 'Date');
      });

      // Client-side search filter
      const searchInput = document.getElementById('leadSearch');
      if (searchInput && !searchInput._bound) {
        searchInput._bound = true;
        searchInput.addEventListener('input', () => {
          const q = searchInput.value.toLowerCase();
          tableBody.querySelectorAll('tr').forEach(tr => {
            const text = tr.textContent.toLowerCase();
            tr.style.display = text.includes(q) ? '' : 'none';
          });
        });
      }

    } catch (err) {
      console.error('Leads load error:', err);
      showToast('Error loading leads');
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering — Lead Detail
  // ---------------------------------------------------------------------------

  /**
   * Populate the lead.html template elements with data from Supabase.
   * lead.html uses individual element IDs rather than a single container.
   */
  async function renderLeadDetail() {
    const session = await Auth.initAuth();
    if (!session) return;

    const id = getUrlParam('id');
    if (!id) {
      window.location.href = 'leads.html';
      return;
    }

    try {
      const lead = await fetchLeadDetail(id);
      const outreach = lead.outreach_packages?.[0] || lead.outreach_packages || null;

      // Helper to safely set text/html by element ID
      function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text || '--';
      }
      function setHtml(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html || '';
      }

      // Lead info card
      setText('leadName', fullName(lead));
      setText('leadTitle', lead.title || '--');
      setText('leadCompany', lead.company || '--');
      setText('leadRegion', lead.region || '--');
      setText('leadICP', lead.icp_segment || '--');
      setText('leadEmail', lead.email || '--');
      setText('leadSource', lead.source || '--');
      setText('leadCreated', formatDate(lead.created_date));

      // Fit score badge
      const fitEl = document.getElementById('leadFitScore');
      if (fitEl) {
        fitEl.textContent = lead.fit_score || '--';
        fitEl.classList.add(scoreClass(lead.fit_score));
      }

      // Website link
      const websiteEl = document.getElementById('leadWebsite');
      if (websiteEl && lead.website_url) {
        websiteEl.textContent = lead.website_url.replace(/^https?:\/\//, '');
        websiteEl.href = lead.website_url;
      }

      // Prospect brief
      if (lead.prospect_brief) {
        setHtml('briefSummary', '<p>' + escapeHtml(lead.prospect_brief) + '</p>');
      } else {
        setHtml('briefSummary', '<p class="text-muted">No prospect brief available.</p>');
      }

      // Outreach package
      if (outreach) {
        // Cold email
        setText('coldEmailSubject', outreach.email_subject || '--');
        if (outreach.email_body) {
          setHtml('coldEmailBody', '<p>' + escapeHtml(outreach.email_body).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>');
        }

        // Follow-ups
        if (outreach.followup_1) {
          setHtml('followup3Body', '<p>' + escapeHtml(outreach.followup_1).replace(/\n/g, '<br>') + '</p>');
        }
        if (outreach.followup_2) {
          setHtml('followup7Body', '<p>' + escapeHtml(outreach.followup_2).replace(/\n/g, '<br>') + '</p>');
        }
        if (outreach.followup_3) {
          setHtml('followup14Body', '<p>' + escapeHtml(outreach.followup_3).replace(/\n/g, '<br>') + '</p>');
        }

        // Sales script
        if (outreach.sales_script) {
          const scriptEl = document.getElementById('salesScript');
          if (scriptEl) {
            // Replace the structured script sections with the full script text
            scriptEl.innerHTML = '<div class="script-section"><p class="script-text">' +
              escapeHtml(outreach.sales_script).replace(/\n\n/g, '</p><p class="script-text">').replace(/\n/g, '<br>') +
              '</p></div>';
          }
        }

        // LinkedIn message
        if (outreach.linkedin_message) {
          setHtml('linkedinMessage', '<p>' + escapeHtml(outreach.linkedin_message) + '</p>');
          const charCount = document.getElementById('linkedinCharCount');
          if (charCount) charCount.textContent = outreach.linkedin_message.length + ' characters';
        }
      }

      // Wire up copy buttons
      const copyCold = document.getElementById('copyColdEmail');
      if (copyCold && outreach) {
        copyCold.addEventListener('click', () => {
          copyToClipboard('Subject: ' + (outreach.email_subject || '') + '\n\n' + (outreach.email_body || ''));
        });
      }
      const copyLI = document.getElementById('copyLinkedIn');
      if (copyLI && outreach) {
        copyLI.addEventListener('click', () => {
          copyToClipboard(outreach.linkedin_message || '');
        });
      }

      // Wire up followup copy buttons
      document.querySelectorAll('[data-copy^="followup"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.copy;
          const text = key === 'followup-3' ? outreach?.followup_1
            : key === 'followup-7' ? outreach?.followup_2
            : outreach?.followup_3;
          if (text) copyToClipboard(text);
        });
      });

    } catch (err) {
      console.error('Lead detail error:', err);
      const nameEl = document.getElementById('leadName');
      if (nameEl) nameEl.textContent = 'Lead not found';
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering — Briefings
  // ---------------------------------------------------------------------------

  let _briefingPage = 1;

  async function renderBriefings() {
    const session = await Auth.initAuth();
    if (!session) return;

    await loadBriefings();

    // Start listening for realtime updates
    setupBriefingsRealtime();
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
            <div class="briefing-card__content">${b.content_html || escapeHtml(b.content || '')}</div><!-- content_html is trusted (generated by our pipeline); fallback uses escapeHtml -->
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
  // Realtime Subscriptions
  // ---------------------------------------------------------------------------

  let _realtimeChannel = null;
  let _realtimeDebounceTimer = null;

  /**
   * Subscribe to Supabase Realtime changes on leads and/or briefings.
   * Debounces rapid inserts (e.g. 40 leads from /syba-daily) into a single
   * re-render after 500ms of quiet.
   *
   * @param {Object} opts
   * @param {Function} [opts.onLeadChange]     – callback when leads table changes
   * @param {Function} [opts.onBriefingChange]  – callback when briefings table changes
   */
  function setupRealtime(opts = {}) {
    // Tear down any previous subscription
    teardownRealtime();

    const sb = Auth.getClient();
    if (!sb) return;

    const channelName = 'dashboard-realtime-' + Date.now();
    let channel = sb.channel(channelName);

    if (opts.onLeadChange) {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        _debounceHandler('lead', opts.onLeadChange)
      );
    }

    if (opts.onBriefingChange) {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'briefings' },
        _debounceHandler('briefing', opts.onBriefingChange)
      );
    }

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Realtime] Subscribed to live updates');
      }
    });

    _realtimeChannel = channel;
  }

  /** Debounce rapid events into a single callback after 500ms of quiet. */
  const _pendingCallbacks = {};
  function _debounceHandler(key, callback) {
    return (payload) => {
      _pendingCallbacks[key] = callback;
      clearTimeout(_realtimeDebounceTimer);
      _realtimeDebounceTimer = setTimeout(() => {
        Object.values(_pendingCallbacks).forEach(cb => {
          try { cb(payload); } catch (e) { console.error('[Realtime] Callback error:', e); }
        });
        // Clear pending after flush
        Object.keys(_pendingCallbacks).forEach(k => delete _pendingCallbacks[k]);
      }, 500);
    };
  }

  function teardownRealtime() {
    if (_realtimeChannel) {
      const sb = Auth.getClient();
      if (sb) sb.removeChannel(_realtimeChannel);
      _realtimeChannel = null;
    }
    clearTimeout(_realtimeDebounceTimer);
  }

  /**
   * Pulse animation on an element to draw attention to new data.
   */
  function pulseElement(el) {
    if (!el) return;
    el.classList.add('realtime-pulse');
    el.addEventListener('animationend', () => el.classList.remove('realtime-pulse'), { once: true });
  }

  // ---------------------------------------------------------------------------
  // Realtime-aware page renderers
  // ---------------------------------------------------------------------------

  /** Dashboard: subscribe to leads + briefings, re-render on change. */
  function setupDashboardRealtime() {
    setupRealtime({
      onLeadChange: async (payload) => {
        showToast('New leads received — refreshing...');
        try {
          const [stats, topLeads] = await Promise.all([
            fetchTodayStats(),
            fetchTopLeads(5)
          ]);
          renderStatsCards(stats, topLeads);
          renderTopLeadsCards(topLeads);
          pulseElement(document.getElementById('stats-grid'));
          pulseElement(document.getElementById('top-leads'));
        } catch (e) { console.error('[Realtime] Dashboard lead refresh error:', e); }
      },
      onBriefingChange: async () => {
        showToast('New briefing available');
        try {
          const briefing = await fetchLatestBriefing();
          renderBriefingCard(briefing);
          pulseElement(document.getElementById('latest-briefing'));
        } catch (e) { console.error('[Realtime] Dashboard briefing refresh error:', e); }
      }
    });
  }

  /** Leads page: subscribe to leads, re-render table on change. */
  function setupLeadsRealtime() {
    setupRealtime({
      onLeadChange: async () => {
        showToast('New leads received — refreshing table...');
        try {
          await loadLeads();
          pulseElement(document.getElementById('leadsTable'));
        } catch (e) { console.error('[Realtime] Leads table refresh error:', e); }
      }
    });
  }

  /** Briefings page: subscribe to briefings, re-render list on change. */
  function setupBriefingsRealtime() {
    setupRealtime({
      onBriefingChange: async () => {
        showToast('New briefing received');
        try {
          await loadBriefings();
          pulseElement(document.getElementById('briefings-list'));
        } catch (e) { console.error('[Realtime] Briefings refresh error:', e); }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Extracted render helpers (used by both initial render + realtime updates)
  // ---------------------------------------------------------------------------

  function renderStatsCards(stats, topLeads) {
    const statsEl = document.getElementById('stats-grid');
    if (!statsEl) return;
    statsEl.innerHTML = `
      <div class="stat-card">
        <div class="stat-card__value accent-text">${stats.totalLeads}</div>
        <div class="stat-card__label">Total Leads</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${stats.outreachCount}</div>
        <div class="stat-card__label">Emails Drafted</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${stats.avgFitScore}</div>
        <div class="stat-card__label">Avg Fit Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${stats.briefingCount}</div>
        <div class="stat-card__label">Intelligence Briefs</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${escapeHtml(stats.topRegion)}</div>
        <div class="stat-card__label">Top Region</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${stats.triggerEvents.length}</div>
        <div class="stat-card__label">Trigger Events</div>
      </div>
    `;

    // Render trigger events if container exists
    const eventsEl = document.getElementById('trigger-events');
    if (eventsEl && stats.triggerEvents.length > 0) {
      eventsEl.innerHTML = stats.triggerEvents.map(evt => `
        <div class="trigger-event-card">
          <div class="trigger-event__header">
            <span class="score-badge ${scoreClass(evt.urgency_score)}">${evt.urgency_score}</span>
            <span class="trigger-event__icp">${escapeHtml(evt.icp_segment || '')}</span>
          </div>
          <p class="trigger-event__summary">${escapeHtml(evt.event_summary || '')}</p>
          <p class="trigger-event__hook">${escapeHtml(evt.email_hook || '')}</p>
        </div>
      `).join('');
    } else if (eventsEl) {
      eventsEl.innerHTML = '<p class="empty-state">No trigger events yet.</p>';
    }

    // Render pipeline breakdown if container exists
    const pipelineEl = document.getElementById('pipeline-breakdown');
    if (pipelineEl && Object.keys(stats.icpCounts).length > 0) {
      const sorted = Object.entries(stats.icpCounts).sort((a, b) => b[1] - a[1]);
      pipelineEl.innerHTML = sorted.map(([segment, count]) => `
        <div class="pipeline-row">
          <span class="pipeline-row__label">${escapeHtml(segment)}</span>
          <div class="pipeline-row__bar-wrap">
            <div class="pipeline-row__bar" style="width:${Math.round(count / stats.totalLeads * 100)}%"></div>
          </div>
          <span class="pipeline-row__count">${count}</span>
        </div>
      `).join('');
    }
  }

  function renderTopLeadsCards(topLeads) {
    const leadsEl = document.getElementById('top-leads');
    if (!leadsEl) return;
    if (topLeads.length === 0) {
      leadsEl.innerHTML = '<p class="empty-state">No leads generated yet.</p>';
    } else {
      leadsEl.innerHTML = topLeads.map(lead => `
        <a href="lead.html?id=${lead.id}" class="lead-card">
          <div class="lead-card__header">
            <div class="lead-card__name">${escapeHtml(fullName(lead))}</div>
            <span class="score-badge ${scoreClass(lead.fit_score)}">${lead.fit_score}</span>
          </div>
          <div class="lead-card__meta">
            <span>${escapeHtml(lead.company || '')}</span>
            ${lead.title ? '<span class="dot-sep"></span><span>' + escapeHtml(lead.title) + '</span>' : ''}
          </div>
          <div class="lead-card__footer">
            <span class="region-tag">${escapeHtml(lead.region || '')}</span>
            ${lead.icp_segment ? '<span class="icp-tag">' + escapeHtml(lead.icp_segment) + '</span>' : ''}
          </div>
        </a>
      `).join('');
    }
  }

  function renderBriefingCard(briefing) {
    const briefingEl = document.getElementById('latest-briefing');
    if (!briefingEl) return;
    if (briefing) {
      briefingEl.innerHTML = `
        <div class="briefing-card briefing-card--expanded">
          <div class="briefing-card__header">
            <span class="briefing-card__date">${formatDate(briefing.created_at)}</span>
          </div>
          <div class="briefing-card__content">${briefing.content_html || escapeHtml(briefing.content || '')}</div>
        </div>
      `;
    } else {
      briefingEl.innerHTML = '<p class="empty-state">No briefings yet.</p>';
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

    // Realtime
    setupDashboardRealtime,
    setupLeadsRealtime,
    setupBriefingsRealtime,
    teardownRealtime,

    // Data (for advanced use)
    fetchTodayStats,
    fetchTopLeads,
    fetchLatestBriefing,
    fetchLeads,
    fetchLeadDetail,
    fetchBriefings,
    exportLeadsCSV,

    // Interactive tracking (V3)
    handleStatusChange,
    updateLeadStatus,
    updateLeadNotes,
    updateFollowUpStage,
    openNotesModal,

    // Helpers
    copyToClipboard,
    formatDate,
    showToast,
    getUrlParam
  };
})();
