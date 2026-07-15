const { createClient } = supabase;
const db = createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_PUBLISHABLE_KEY);
const $ = (id) => document.getElementById(id);

const dimensionInfo = {
  trust: {
    label: "Vertrauen",
    focus: "Wie leicht gute Absichten angenommen werden können und ob Nähe eher geprüft, vermieden oder grundsätzlich als riskant erlebt wird.",
    bands: [
      "Die Antworten sprechen für ein grundsätzlich vorhandenes Vertrauen, das mit angemessener Prüfung verbunden werden kann.",
      "Es zeigt sich erhöhte Vorsicht. Vertrauen scheint möglich, wird aber häufiger abgesichert oder langsamer aufgebaut.",
      "Mehrere Antworten weisen auf ausgeprägtes Misstrauen, die Erwartung verborgener Absichten oder vorsorglichen Rückzug hin.",
      "Das Antwortmuster deutet auf ein sehr starkes Gefahrengefühl in Vertrauenssituationen und erhebliche Schwierigkeiten hin, gute Absichten als sicher zu erleben."
    ]
  },
  attachment: {
    label: "Nähe und Bindung",
    focus: "Umgang mit emotionaler Nähe, Fürsorge, zunehmender Verbindlichkeit und vorübergehender Distanz wichtiger Personen.",
    bands: [
      "Nähe und Eigenständigkeit wirken überwiegend vereinbar. Fürsorge und Verbindlichkeit können angenommen werden.",
      "Nähe ist grundsätzlich möglich, löst aber teilweise Unsicherheit oder ein erhöhtes Bedürfnis nach Abstand und Kontrolle aus.",
      "Das Muster zeigt ein deutliches Spannungsfeld zwischen dem Wunsch nach Beziehung und dem Schutz vor Verletzlichkeit, Abhängigkeit oder Verlassenwerden.",
      "Nähe scheint häufig als Bedrohung erlebt zu werden. Starker Rückzug, vorsorgliche Distanz oder intensive Verlustangst können Beziehungen erheblich belasten."
    ]
  },
  boundaries: {
    label: "Grenzen und Zustimmung",
    focus: "Fähigkeit, ein Nein aufrechtzuerhalten, körperliche Grenzen mitzuteilen und die Grenzen anderer ohne Selbstabwertung zu akzeptieren.",
    bands: [
      "Eigene und fremde Grenzen können überwiegend klar wahrgenommen, mitgeteilt und respektiert werden.",
      "Grenzen werden grundsätzlich vertreten, sind bei Druck, Enttäuschung oder Konflikten jedoch teilweise mit Unsicherheit verbunden.",
      "Mehrere Antworten sprechen dafür, dass Druck, Schuldgefühle, Erstarren oder Angst vor Eskalation das Aufrechterhalten eigener Grenzen erschweren.",
      "Die Antworten weisen auf erhebliche Schwierigkeiten hin, in belastenden Situationen handlungsfähig zu bleiben oder ein Nein gegen Druck zu schützen."
    ]
  },
  control: {
    label: "Kontrolle und Autonomie",
    focus: "Erleben von Abhängigkeit, Kontrollabgabe, eingeschränkten Rückzugsmöglichkeiten und fremdbestimmten Entscheidungen.",
    bands: [
      "Kontrolle kann situationsgerecht geteilt oder abgegeben werden, ohne dass das Gefühl eigener Handlungsfähigkeit verloren geht.",
      "Ein erhöhtes Bedürfnis nach Information, Rückzugsmöglichkeiten und eigener Absicherung ist erkennbar, bleibt aber meist flexibel.",
      "Abhängigkeit oder Kontrollverlust lösen deutliches Unbehagen aus. Dies kann zu Überkontrolle, Ablehnung von Hilfe oder vorschnellem Rückzug führen.",
      "Fremdbestimmung und eingeschränkte Flucht- oder Entscheidungsmöglichkeiten werden sehr stark als Bedrohung erlebt und können heftige Reaktionen auslösen."
    ]
  },
  hyperarousal: {
    label: "Sicherheit und Alarmbereitschaft",
    focus: "Körperliche und gedankliche Alarmreaktionen bei unklaren Geräuschen, möglicher Verfolgung, Streit oder eingeschränkten Auswegen.",
    bands: [
      "Mögliche Gefahren werden wahrgenommen, ohne dass der Körper länger als nötig in Alarmbereitschaft bleibt.",
      "Es besteht eine erhöhte Wachsamkeit, die sich nach Klärung der Situation meist wieder regulieren lässt.",
      "Mehrere Situationen lösen anhaltende Anspannung, intensive Gefahrenprüfung oder deutliche körperliche Alarmreaktionen aus.",
      "Das Nervensystem scheint sehr schnell und stark auf mögliche Gefahr zu reagieren. Beruhigung und Rückkehr in ein Sicherheitsgefühl können erheblich erschwert sein."
    ]
  },
  conflict: {
    label: "Konflikte und Dominanz",
    focus: "Reaktion auf scharfe Kritik, Lautstärke, mögliche Eskalation, Meinungsverschiedenheiten und Entschuldigungen nach Grenzüberschreitungen.",
    bands: [
      "Konflikte können überwiegend mit Selbstbehauptung, zeitlichem Abstand oder differenzierter Vertrauensprüfung bewältigt werden.",
      "Konflikte erzeugen spürbares Unbehagen. Vorsicht und Deeskalation stehen teilweise stärker im Vordergrund als die eigene Position.",
      "Lautstärke, Dominanz oder mögliche Ablehnung führen mehrfach zu Erstarren, Anpassung, starkem Grübeln oder dauerhaftem Vertrauensverlust.",
      "Konflikte scheinen häufig als unmittelbare Bedrohung erlebt zu werden und können Handlungsfähigkeit, Selbstbehauptung und Beziehungssicherheit stark einschränken."
    ]
  },
  selfworth: {
    label: "Selbstwert und Scham",
    focus: "Trennung zwischen erlebten Fehlern beziehungsweise Täuschungen und dem eigenen Wert sowie Fähigkeit, Anerkennung anzunehmen.",
    bands: [
      "Fehler und enttäuschtes Vertrauen werden überwiegend als begrenzte Erfahrungen verarbeitet, ohne den eigenen Wert grundsätzlich infrage zu stellen.",
      "Selbstkritik und Unsicherheit sind erkennbar, können aber meist noch von einer vollständigen Selbstabwertung getrennt werden.",
      "Mehrere Antworten zeigen anhaltende Selbstvorwürfe, Scham, starke Sorge vor Bewertung oder Schwierigkeiten, Positives über die eigene Person anzunehmen.",
      "Das Antwortmuster weist auf eine tiefgreifende negative Selbstbewertung hin, bei der Fehler, Verletzungen oder Sichtbarkeit schnell als Beweis persönlicher Minderwertigkeit erlebt werden."
    ]
  },
  body: {
    label: "Körperbezug",
    focus: "Erleben des eigenen Körpers, körperliche Selbstbestimmung, Reaktion auf unerwartete Berührung und Fähigkeit, angenehme Empfindungen zuzulassen.",
    bands: [
      "Der Körper wird überwiegend als eigener, handlungsfähiger und auch angenehmer Teil der Person erlebt.",
      "Körpernähe oder Entspannung lösen teilweise Anspannung aus, bleiben aber grundsätzlich steuer- und kommunizierbar.",
      "Mehrere Antworten weisen auf starke körperliche Alarmreaktionen, Distanz zum eigenen Körper oder Vermeidung körpernaher Situationen hin.",
      "Der Körper kann deutlich als fremd, belastet oder unsicher erlebt werden. Medizinische Versorgung, Berührung und Entspannung könnten dadurch erheblich beeinträchtigt sein."
    ]
  },
  emotion: {
    label: "Emotionsregulation",
    focus: "Wahrnehmen, Einordnen und Beruhigen starker Gefühle sowie Umgang mit Ruhe, Verletzung und Mehrfachbelastung.",
    bands: [
      "Gefühle können überwiegend wahrgenommen, eingeordnet und mit passenden Strategien reguliert werden.",
      "Starke Gefühle benötigen teilweise mehr Zeit, Struktur oder Unterstützung, ohne regelmäßig die Handlungsfähigkeit zu übernehmen.",
      "Es zeigen sich wiederholt Verdrängung, Überfunktionieren, starke Überwältigung oder Schwierigkeiten, eigene Bedürfnisse rechtzeitig wahrzunehmen.",
      "Emotionale Belastung führt häufig zu innerem Abschalten, Erstarren, Kontrollverlust oder einem Verlust des Gegenwartsbezugs."
    ]
  },
  avoidance: {
    label: "Vermeidung und belastende Erinnerungen",
    focus: "Umgang mit Erinnerungsorten, schwierigen Darstellungen, Gesprächen über die Vergangenheit und plötzlich auftauchenden Erinnerungen.",
    bands: [
      "Belastende Erinnerungen können überwiegend als Vergangenheit erkannt werden, ohne den aktuellen Alltag stark einzuschränken.",
      "Bestimmte Inhalte werden bewusst dosiert oder zeitweise vermieden; die Person behält dabei meist Wahlmöglichkeiten.",
      "Vermeidung, starke Anspannung oder emotional distanziertes Erzählen treten mehrfach auf und können Alltag oder Beziehungen einschränken.",
      "Erinnerungen oder Auslöser scheinen zeitweise sehr gegenwärtig zu werden und können zu intensiver Vermeidung, Wiedererleben oder innerem Wegtreten führen."
    ]
  },
  support: {
    label: "Hilfe und soziale Unterstützung",
    focus: "Fähigkeit, Belastung mitzuteilen, Bedürfnisse zu benennen und private oder professionelle Unterstützung anzunehmen.",
    bands: [
      "Unterstützung kann überwiegend gesucht, geprüft und angenommen werden. Eigene Bedürfnisse lassen sich benennen.",
      "Hilfe ist möglich, wird aber eher spät, vorsichtig oder nach eigener Vorleistung in Anspruch genommen.",
      "Die Person verbirgt Belastungen häufiger, möchte andere nicht belasten oder fürchtet Bewertung und Kontrolle durch Helfende.",
      "Unterstützung wird stark als gefährlich, beschämend oder aussichtslos erlebt. Dadurch könnte die Person selbst bei erheblicher Belastung isoliert bleiben."
    ]
  },
  future: {
    label: "Sinn, Hoffnung und Zukunft",
    focus: "Zukunftsvorstellungen, erlebte Selbstwirksamkeit, Bedeutung emotionalen Schmerzes und Einordnung schwerer Lebensphasen.",
    bands: [
      "Die Zukunft kann grundsätzlich hoffnungsvoll gedacht werden. Schwierige Erfahrungen werden als Teil, nicht als vollständige Definition der Person erlebt.",
      "Die Zukunft wird vorsichtig gesehen. Sinn und Einfluss sind vorhanden, werden aber teilweise durch Unsicherheit relativiert.",
      "Zukunftsplanung, Selbstwirksamkeit oder die Anerkennung emotionalen Schmerzes erscheinen deutlich eingeschränkt oder werden stark relativiert.",
      "Die Antworten weisen auf geringe Hoffnung, ein starkes Gefühl der Bedeutungslosigkeit eigener Pläne oder einen als dauerhaft verloren erlebten Teil des Lebens hin."
    ]
  },
  work: {
    label: "Arbeit und Autoritäten",
    focus: "Selbstständigkeit bei unklaren Anforderungen, Reaktion auf Machtmissbrauch, Fehler von Autoritäten und öffentliche Sichtbarkeit.",
    bands: [
      "Autorität und Leistung können überwiegend differenziert behandelt werden. Eigene Entscheidungen und sachliche Gegenpositionen bleiben möglich.",
      "Es besteht erhöhte Vorsicht gegenüber Fehlern, Macht und Sichtbarkeit, ohne dass die Handlungsfähigkeit regelmäßig verloren geht.",
      "Angst vor Kritik, starke Anpassung, Blockierung oder Vermeidung von Sichtbarkeit treten in mehreren beruflichen Situationen auf.",
      "Machtgefälle und Bewertung scheinen sehr stark mit Gefahr verbunden zu sein und können zu erheblicher Überanpassung, Überarbeitung, Hilflosigkeit oder Rückzug führen."
    ]
  },
  joy: {
    label: "Freude und Erholung",
    focus: "Fähigkeit, freie Zeit, Überraschungen, entspannte Gemeinschaft und Stolz auf Bewältigtes positiv zu erleben.",
    bands: [
      "Freude, Entspannung und Stolz sind überwiegend zugänglich und können ohne ständige Wachsamkeit erlebt werden.",
      "Erholung ist möglich, benötigt aber teilweise Anlaufzeit, Vorhersehbarkeit oder eine besonders sichere Umgebung.",
      "Ruhe, Überraschungen oder Nähe lösen mehrfach Unbehagen, Leere, Misstrauen oder anhaltende Beobachtung der Umgebung aus.",
      "Positive Situationen werden stark von Alarm, Misstrauen, innerer Leere oder der Bedeutung früherer Erfahrungen überlagert."
    ]
  },
  integration: {
    label: "Integration und Resilienz",
    focus: "Fähigkeit, wiederkehrende Muster zu reflektieren, Sicherheit in der Gegenwart zu nutzen und neue positive Erfahrungen aufzunehmen.",
    bands: [
      "Schwierige Erfahrungen beeinflussen die Person, ohne ihre heutigen Wahlmöglichkeiten grundsätzlich zu bestimmen. Neue Erfahrungen können das Sicherheitsgefühl erweitern.",
      "Einige Bereiche bleiben empfindlich, gleichzeitig sind Reflexion, neue Strategien und korrigierende Erfahrungen grundsätzlich möglich.",
      "Die Person funktioniert, doch alte Muster, Gefahrengefühle oder Rückzugstendenzen bleiben deutlich wirksam und verändern sich nur begrenzt durch positive Erfahrungen.",
      "Frühere Machtlosigkeit oder Angst scheint viele aktuelle Lebensbereiche stark zu organisieren. Gegenwartswissen und neue Erfahrungen erreichen das innere Gefahrengefühl nur wenig."
    ]
  }
};

const dimensionOrder = Object.keys(dimensionInfo);
const questionById = new Map(QUESTIONS.map((question) => [Number(question.id), question]));
const answerLevelLabels = [
  "flexibel / wenig belastungsnah",
  "vorsichtig / leicht belastungsnah",
  "deutlich belastungsnah",
  "stark belastungsnah"
];

let sessions = [];
let responses = [];
let selectedSessionId = null;
let realtimeChannel = null;
let loadTimer = null;
let pendingDeleteAction = null;

$("loginBtn").addEventListener("click", login);
$("password").addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});
$("logoutBtn").addEventListener("click", async () => {
  await db.auth.signOut();
  location.reload();
});
$("backBtn").addEventListener("click", () => {
  selectedSessionId = null;
  $("detail").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("toggleAnswersBtn").addEventListener("click", toggleAnswers);
$("answerFilter").addEventListener("change", renderAnswers);
$("answerSort").addEventListener("change", renderAnswers);
$("deleteSessionBtn").addEventListener("click", () => {
  if (selectedSessionId) requestDeleteSession(selectedSessionId);
});
$("deleteAllBtn").addEventListener("click", requestDeleteAll);
$("confirmDeleteBtn").addEventListener("click", executeConfirmedDelete);
$("cancelConfirmBtn").addEventListener("click", () => { pendingDeleteAction = null; $("confirmDialog").close(); });

async function login() {
  $("loginBtn").disabled = true;
  $("loginStatus").textContent = "Anmeldung läuft …";
  const { error } = await db.auth.signInWithPassword({
    email: $("email").value.trim(),
    password: $("password").value
  });
  $("loginBtn").disabled = false;
  $("loginStatus").textContent = error ? error.message : "";
  if (!error) await init();
}

async function init() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) return;

  $("loginCard").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");
  populateAnswerFilter();
  await load();

  if (realtimeChannel) await db.removeChannel(realtimeChannel);
  realtimeChannel = db
    .channel("dashboard-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "assessment_sessions" }, scheduleLoad)
    .on("postgres_changes", { event: "*", schema: "public", table: "responses" }, scheduleLoad)
    .subscribe();
}

function scheduleLoad() {
  clearTimeout(loadTimer);
  loadTimer = setTimeout(load, 180);
}

async function load() {
  $("tableStatus").textContent = "Daten werden aktualisiert …";
  const [sessionResult, responseResult] = await Promise.all([
    db.from("assessment_sessions").select("*").order("started_at", { ascending: false }),
    db.from("responses").select("*").order("question_id", { ascending: true })
  ]);

  if (sessionResult.error || responseResult.error) {
    $("tableStatus").textContent = "Datenzugriff fehlgeschlagen. Bitte Admin-RLS und Anmeldung prüfen.";
    console.error(sessionResult.error || responseResult.error);
    return;
  }

  sessions = sessionResult.data ?? [];
  responses = responseResult.data ?? [];
  $("tableStatus").textContent = "";
  renderOverview();

  if (selectedSessionId) {
    if (sessions.some((session) => session.id === selectedSessionId)) {
      renderDetail(selectedSessionId);
    } else {
      selectedSessionId = null;
      $("detail").classList.add("hidden");
    }
  }
}

function renderOverview() {
  const completed = sessions.filter((session) => session.status === "completed").length;
  const inProgress = sessions.length - completed;
  const completeResponses = sessions.reduce((sum, session) => {
    return sum + responses.filter((response) => response.session_id === session.id).length;
  }, 0);

  $("summary").innerHTML = `
    <div class="metric"><span>Teilnahmen</span><b>${sessions.length}</b></div>
    <div class="metric"><span>Abgeschlossen</span><b>${completed}</b></div>
    <div class="metric"><span>In Bearbeitung</span><b>${inProgress}</b></div>
    <div class="metric"><span>Gespeicherte Antworten</span><b>${completeResponses}</b></div>
  `;

  if (!sessions.length) {
    $("sessions").innerHTML = `<tr><td colspan="6"><div class="empty">Noch keine Teilnahmen gespeichert.</div></td></tr>`;
    return;
  }

  $("sessions").innerHTML = sessions.map((session) => {
    const sessionResponses = getSessionResponses(session.id);
    const scores = calculateDimensionScores(sessionResponses).filter((item) => item.avg !== null);
    const highest = scores.sort((a, b) => b.avg - a.avg)[0];
    const statusLabel = session.status === "completed" ? "abgeschlossen" : "in Bearbeitung";
    const highestText = highest ? `${highest.label}: ${highest.avg.toFixed(2)}` : "noch keine Daten";

    return `
      <tr>
        <td><strong>${escapeHtml(session.participant_code)}</strong></td>
        <td><span class="status-pill status-${session.status}">${statusLabel}</span></td>
        <td>${sessionResponses.length}/${session.total_questions}</td>
        <td>${escapeHtml(highestText)}</td>
        <td>${formatDate(session.started_at)}</td>
        <td>
          <div class="table-actions">
            <button class="button primary small-button" data-open="${session.id}">Auswerten</button>
            <button class="button danger-outline small-button" data-delete="${session.id}">Löschen</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openDetail(button.dataset.open));
  });
  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => requestDeleteSession(button.dataset.delete));
  });
}

function openDetail(sessionId) {
  selectedSessionId = sessionId;
  $("detail").classList.remove("hidden");
  $("answersPanel").classList.add("hidden");
  $("toggleAnswersBtn").textContent = "Einzelantworten anzeigen";
  $("toggleAnswersBtn").setAttribute("aria-expanded", "false");
  $("answerFilter").value = "all";
  $("answerSort").value = "question";
  renderDetail(sessionId);
  $("detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDetail(sessionId) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) return;

  const sessionResponses = getSessionResponses(sessionId);
  const dimensionScores = calculateDimensionScores(sessionResponses);
  const completedText = session.completed_at ? formatDate(session.completed_at) : "noch nicht abgeschlossen";

  $("detailTitle").textContent = `Profil: ${session.participant_code}`;
  $("detailMeta").textContent = `${sessionResponses.length}/${session.total_questions} Antworten · Beginn: ${formatDate(session.started_at)} · Abschluss: ${completedText}`;
  renderProfileSummary(session, sessionResponses, dimensionScores);
  renderDimensions(dimensionScores);
  renderAnswers();
}

function renderProfileSummary(session, sessionResponses, scores) {
  const available = scores.filter((score) => score.avg !== null);
  const sortedHigh = [...available].sort((a, b) => b.avg - a.avg);
  const sortedLow = [...available].sort((a, b) => a.avg - b.avg);
  const overall = sessionResponses.length
    ? sessionResponses.reduce((sum, response) => sum + Number(response.answer_value), 0) / sessionResponses.length
    : null;
  const overallBand = overall === null ? null : getBand(overall);
  const highAreas = sortedHigh.filter((item) => item.avg >= 1.5).slice(0, 3);
  const resourceAreas = sortedLow.filter((item) => item.avg <= 1.0).slice(0, 3);
  const statusNote = session.status === "completed"
    ? "Alle vorgesehenen Antworten liegen vor."
    : "Die Teilnahme ist noch nicht abgeschlossen; alle Aussagen sind daher vorläufig.";

  const highestText = sortedHigh.length
    ? sortedHigh.slice(0, 3).map((item) => `${item.label} (${item.avg.toFixed(2)})`).join(", ")
    : "noch nicht bestimmbar";
  const resourcesText = resourceAreas.length
    ? resourceAreas.map((item) => `${item.label} (${item.avg.toFixed(2)})`).join(", ")
    : "Derzeit ist kein Bereich mit ausreichend niedrigem Wert eindeutig erkennbar.";

  let synthesis;
  if (overall === null) {
    synthesis = "Es liegen noch keine auswertbaren Antworten vor.";
  } else if (!highAreas.length) {
    synthesis = "Das Profil zeigt derzeit keine breit ausgeprägten belastungsnahen Bereichswerte. Einzelne hohe Antworten können dennoch situativ bedeutsam sein.";
  } else {
    synthesis = `Die stärksten belastungsnahen Muster liegen derzeit in ${highAreas.map((item) => item.label).join(", ")}. Diese Kombination beschreibt aktuelle Reaktionsweisen, erlaubt aber keinen Rückschluss auf eine bestimmte Ursache.`;
  }

  $("profileSummary").innerHTML = `
    <h2>Profilzusammenfassung</h2>
    <p>${escapeHtml(statusNote)}</p>
    <div class="profile-overview">
      <div class="profile-box">
        <h3>Gesamtwert</h3>
        <p>${overall === null ? "keine Daten" : `<strong>${overall.toFixed(2)} / 3</strong><br><span class="level-pill level-${overallBand}">${answerLevelLabels[overallBand]}</span>`}</p>
      </div>
      <div class="profile-box">
        <h3>Höchste Bereichswerte</h3>
        <p>${escapeHtml(highestText)}</p>
      </div>
      <div class="profile-box">
        <h3>Mögliche Ressourcen</h3>
        <p>${escapeHtml(resourcesText)}</p>
      </div>
      <div class="profile-box">
        <h3>Zusammenfassende Einordnung</h3>
        <p>${escapeHtml(synthesis)}</p>
      </div>
    </div>
  `;
}

function renderDimensions(scores) {
  const sorted = [...scores].sort((a, b) => {
    if (a.avg === null) return 1;
    if (b.avg === null) return -1;
    return b.avg - a.avg;
  });

  $("dimensions").innerHTML = sorted.map((item, index) => {
    if (item.avg === null) {
      return `
        <article class="dimension-card">
          <div class="dimension-head">
            <div><div class="dimension-title">${escapeHtml(item.label)}</div><div class="muted">Rang –</div></div>
            <div class="score">keine Daten</div>
          </div>
          <p class="dimension-text">Für diesen Bereich liegt noch keine Antwort vor.</p>
          <p class="dimension-note">${escapeHtml(item.focus)}</p>
        </article>
      `;
    }

    const band = getBand(item.avg);
    const percentage = Math.round((item.avg / 3) * 100);
    const patternText = describePattern(item.values);
    return `
      <article class="dimension-card">
        <div class="dimension-head">
          <div>
            <div class="dimension-title">${escapeHtml(item.label)}</div>
            <div class="muted">Rang ${index + 1} · ${item.values.length}/4 beantwortet</div>
          </div>
          <div class="score">${item.avg.toFixed(2)} / 3</div>
        </div>
        <div class="bar" aria-label="${percentage} Prozent des Maximalwertes"><div style="width:${percentage}%"></div></div>
        <div class="dimension-stats">
          <span class="level-pill level-${band}">${answerLevelLabels[band]}</span>
          <span class="stat-chip">C/D-Antworten: ${item.highCount}/${item.values.length}</span>
          <span class="stat-chip">höchster Einzelwert: ${item.max}/3</span>
        </div>
        <p class="dimension-text">${escapeHtml(item.interpretation)}</p>
        <p class="dimension-note"><strong>Antwortmuster:</strong> ${escapeHtml(patternText)}<br><strong>Erfasst:</strong> ${escapeHtml(item.focus)}</p>
      </article>
    `;
  }).join("");
}

function calculateDimensionScores(sessionResponses) {
  return dimensionOrder.map((key) => {
    const info = dimensionInfo[key];
    const values = sessionResponses
      .filter((response) => response.dimension === key)
      .map((response) => Number(response.answer_value));
    const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    const band = avg === null ? null : getBand(avg);
    return {
      key,
      label: info.label,
      focus: info.focus,
      values,
      avg,
      max: values.length ? Math.max(...values) : null,
      min: values.length ? Math.min(...values) : null,
      highCount: values.filter((value) => value >= 2).length,
      interpretation: band === null ? "" : info.bands[band]
    };
  });
}

function describePattern(values) {
  if (!values.length) return "keine Daten";
  const highCount = values.filter((value) => value >= 2).length;
  const spread = Math.max(...values) - Math.min(...values);
  let consistency;
  if (highCount >= 3) consistency = "Das belastungsnahe Muster zeigt sich in fast allen Szenarien dieses Bereichs.";
  else if (highCount === 2) consistency = "Das Muster tritt in mehreren, aber nicht allen Szenarien auf.";
  else if (highCount === 1) consistency = "Eine einzelne Situation fällt deutlich auf; der Bereich ist insgesamt eher heterogen.";
  else consistency = "Keines der beantworteten Szenarien erreicht eine C- oder D-Antwort.";

  if (spread >= 2) consistency += " Die große Streuung spricht für eine deutliche Abhängigkeit vom jeweiligen Kontext.";
  else if (spread === 0 && values.length > 1) consistency += " Die Antworten sind innerhalb des Bereichs sehr einheitlich.";
  return consistency;
}

function toggleAnswers() {
  const isHidden = $("answersPanel").classList.toggle("hidden");
  $("toggleAnswersBtn").textContent = isHidden ? "Einzelantworten anzeigen" : "Einzelantworten ausblenden";
  $("toggleAnswersBtn").setAttribute("aria-expanded", String(!isHidden));
  if (!isHidden) renderAnswers();
}

function populateAnswerFilter() {
  $("answerFilter").innerHTML = `
    <option value="all">Alle Bereiche</option>
    ${dimensionOrder.map((key) => `<option value="${key}">${escapeHtml(dimensionInfo[key].label)}</option>`).join("")}
  `;
}

function renderAnswers() {
  if (!selectedSessionId) return;
  const filter = $("answerFilter").value;
  const sort = $("answerSort").value;
  let list = getSessionResponses(selectedSessionId).map((response) => ({
    ...response,
    question: questionById.get(Number(response.question_id))
  }));

  if (filter !== "all") list = list.filter((item) => item.dimension === filter);
  if (sort === "score-desc") list.sort((a, b) => Number(b.answer_value) - Number(a.answer_value) || Number(a.question_id) - Number(b.question_id));
  else if (sort === "score-asc") list.sort((a, b) => Number(a.answer_value) - Number(b.answer_value) || Number(a.question_id) - Number(b.question_id));
  else list.sort((a, b) => Number(a.question_id) - Number(b.question_id));

  if (!list.length) {
    $("answersList").innerHTML = `<div class="empty">Für diesen Filter liegen keine Antworten vor.</div>`;
    return;
  }

  $("answersList").innerHTML = list.map((item) => {
    const value = Number(item.answer_value);
    const question = item.question;
    const optionLetter = String.fromCharCode(65 + value);
    const selectedOption = question?.options?.[value] ?? "Antworttext nicht gefunden";
    const scenario = question?.scenario ?? `Frage ${item.question_id}`;
    const label = dimensionInfo[item.dimension]?.label ?? item.dimension;

    return `
      <article class="answer-card">
        <div class="answer-card-head">
          <div><strong>Frage ${item.question_id}</strong> · ${escapeHtml(label)}</div>
          <span class="level-pill level-${value}">${optionLetter} · ${value}/3</span>
        </div>
        <div class="answer-question" lang="es">${escapeHtml(scenario)}</div>
        <div class="answer-selected" lang="es"><strong>Gewählte Antwort ${optionLetter}:</strong> ${escapeHtml(selectedOption)}</div>
        <div class="answer-meta">${escapeHtml(answerLevelLabels[value])} · gespeichert: ${formatDate(item.answered_at)} · Eine Einzelantwort darf nicht isoliert diagnostisch interpretiert werden.</div>
      </article>
    `;
  }).join("");
}

function requestDeleteSession(sessionId) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) return;
  openConfirmDialog({
    title: "Teilnahme endgültig löschen",
    message: `Die Teilnahme „${session.participant_code}“ und sämtliche zugehörigen Antworten werden unwiderruflich aus der Datenbank gelöscht.`,
    phrase: session.participant_code,
    action: async () => {
      const { data, error } = await db.rpc("delete_assessment_session", {
        p_session_id: sessionId
      });
      if (error) throw error;
      if (Number(data) !== 1) {
        throw new Error(`Unerwartete Rückmeldung der Datenbank: ${JSON.stringify(data)}`);
      }
      if (selectedSessionId === sessionId) {
        selectedSessionId = null;
        $("detail").classList.add("hidden");
      }
      await load();
      return `Die Teilnahme „${session.participant_code}“ und ihre Antworten wurden gelöscht.`;
    }
  });
}

function requestDeleteAll() {
  if (!sessions.length) {
    $("tableStatus").textContent = "Es sind keine Teilnahmen zum Löschen vorhanden.";
    return;
  }
  openConfirmDialog({
    title: "Alle Befragungsdaten endgültig löschen",
    message: `Es werden ${sessions.length} Teilnahmen und alle zugehörigen Antworten unwiderruflich gelöscht. Admin-Konten und die Tabellenstruktur bleiben erhalten.`,
    phrase: "ALLE LÖSCHEN",
    action: async () => {
      const { data, error } = await db.rpc("delete_all_assessment_data_v2");
      if (error) throw error;
      selectedSessionId = null;
      $("detail").classList.add("hidden");
      await load();
      const deletedSessions = Number(data?.deleted_sessions ?? 0);
      const deletedResponses = Number(data?.deleted_responses ?? 0);
      return `${deletedSessions} Teilnahmen und ${deletedResponses} Antworten wurden gelöscht.`;
    }
  });
}

function openConfirmDialog({ title, message, phrase, action }) {
  pendingDeleteAction = { phrase, action };
  $("confirmTitle").textContent = title;
  $("confirmMessage").textContent = message;
  $("confirmPhrase").textContent = phrase;
  $("confirmInput").value = "";
  $("confirmError").textContent = "";
  $("confirmDeleteBtn").disabled = false;
  $("confirmDialog").showModal();
  setTimeout(() => $("confirmInput").focus(), 50);
}

async function executeConfirmedDelete(event) {
  event.preventDefault();
  if (!pendingDeleteAction) return;
  if ($("confirmInput").value.trim() !== pendingDeleteAction.phrase) {
    $("confirmError").textContent = "Der Bestätigungstext stimmt nicht überein.";
    return;
  }

  $("confirmDeleteBtn").disabled = true;
  $("confirmError").textContent = "Löschung läuft …";
  try {
    const successMessage = await pendingDeleteAction.action();
    pendingDeleteAction = null;
    $("confirmDialog").close();
    $("tableStatus").textContent = successMessage || "Die ausgewählten Daten wurden gelöscht.";
  } catch (error) {
    console.error("Supabase-Löschfehler:", error);
    const details = [error.message, error.details, error.hint, error.code]
      .filter(Boolean)
      .join(" · ");
    $("confirmError").textContent = `Löschen fehlgeschlagen: ${details || "Unbekannter Datenbankfehler"}`;
    $("confirmDeleteBtn").disabled = false;
  }
}

function getSessionResponses(sessionId) {
  return responses.filter((response) => response.session_id === sessionId);
}

function getBand(avg) {
  if (avg < 0.75) return 0;
  if (avg < 1.5) return 1;
  if (avg < 2.25) return 2;
  return 3;
}

function formatDate(value) {
  if (!value) return "–";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "–" : date.toLocaleString("de-DE");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

init();
