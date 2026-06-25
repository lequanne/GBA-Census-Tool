import { useState, useEffect } from "react";

/* ============================== THEME ============================== */
const T = {
  bg: "#0e1117", surface: "#161b25", card: "#1c2333", border: "#2a3347",
  text: "#e8edf5", muted: "#7a8ba8", hint: "#4a5a78",
  green: "#1a9e75", greenBg: "#0d2b22", greenTxt: "#4ecfa0", greenPill: "#0f3d2c",
  bluePill: "#0d2040", blueTxt: "#5ba3e0",
  red: "#c0392b", redBg: "#2a1018", redTxt: "#f07070",
  amber: "#c07830", amberBg: "#2a1e08", amberTxt: "#e0a060",
  purple: "#7a5fd0", purpleBg: "#1e1030", purpleTxt: "#9b87e0",
  pink: "#c0508a", pinkBg: "#2a1028", pinkTxt: "#d080b0",
  coral: "#c0633c", coralBg: "#2a1510", coralTxt: "#e07858",
};

const sLabel = { fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, display: "block" };
const card = { border: `0.5px solid ${T.border}`, borderRadius: 12, padding: "1rem 1.25rem", background: T.card, marginBottom: 10 };
const btnSec = { padding: "8px 14px", background: "transparent", color: T.muted, border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" };
const btnPrimary = (loading) => ({ padding: "9px 18px", background: loading ? T.hint : T.green, color: "#e8f5f0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" });
const inputBase = { border: `0.5px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", background: T.surface, color: T.text, outline: "none", boxSizing: "border-box" };
const pillTab = (active) => ({ padding: "6px 13px", fontSize: 12, cursor: "pointer", border: `0.5px solid ${active ? T.green : T.border}`, borderRadius: 20, background: active ? T.greenBg : "transparent", color: active ? T.greenTxt : T.muted, fontWeight: active ? 500 : 400, fontFamily: "inherit", whiteSpace: "nowrap" });
const badge = (bg, color, txt) => <span style={{ background: bg, color, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{txt}</span>;

function round(n, d = 0) { const m = Math.pow(10, d); return Math.round(n * m) / m; }

/* ============================== I18N ==============================
   `pick(field, lang)` reads a {en, fr} pair (or a plain string).
   `UI` is the chrome dictionary; `useT(lang)` returns a t(key) lookup fn. */
function pick(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
}

const UI = {
  appTitle: { en: "GBA+ Census Tool", fr: "Outil de recensement ACS+" },
  appSubtitle: { en: "Gender-Based Analysis Plus · Intersectional policy lens · Canadian GRC compliance", fr: "Analyse comparative entre les sexes plus · Lentille intersectionnelle · Conformité GRC canadienne" },
  badgeText: { en: "GBA+ Framework · Claude API · MCP Layer", fr: "Cadre ACS+ · API Claude · Couche MCP" },
  tabSynthesis: { en: "Document Synthesis", fr: "Synthèse de documents" },
  tabTwin: { en: "Survey Testing Twin", fr: "Jumeau de test de sondages" },

  // Document Synthesis
  dsTabInput: { en: "Input", fr: "Saisie" },
  dsTabSettings: { en: "Settings", fr: "Paramètres" },
  dsDocLabel: { en: "Document text", fr: "Texte du document" },
  dsDocPlaceholder: { en: "Paste a policy, program description, report, or any document to analyze through the GBA+ lens…", fr: "Collez une politique, une description de programme, un rapport ou tout document à analyser selon la lentille de l'ACS+…" },
  dsWordsSuffix: { en: "words", fr: "mots" },
  dsWordSuffix: { en: "word", fr: "mot" },
  dsFactorsLabel: { en: "GBA+ identity factors to analyze", fr: "Facteurs identitaires de l'ACS+ à analyser" },
  dsSelectAll: { en: "Select all", fr: "Tout sélectionner" },
  dsClearAll: { en: "Clear all", fr: "Tout désélectionner" },
  dsSelected: { en: "selected", fr: "sélectionné(s)" },
  dsAnalysisConfig: { en: "Analysis configuration", fr: "Configuration de l'analyse" },
  dsDepth: { en: "Depth", fr: "Profondeur" },
  dsSummaryOpt: { en: "Summary", fr: "Sommaire" },
  dsDetailedOpt: { en: "Detailed", fr: "Détaillée" },
  dsExpertOpt: { en: "Expert", fr: "Experte" },
  dsOutputLanguage: { en: "Output language", fr: "Langue de la sortie" },
  dsDocType: { en: "Document type", fr: "Type de document" },
  dsDocTypePolicy: { en: "Policy / regulation", fr: "Politique / règlement" },
  dsDocTypeProgram: { en: "Program", fr: "Programme" },
  dsDocTypeReport: { en: "Report / research", fr: "Rapport / recherche" },
  dsDocTypeProposal: { en: "Proposal", fr: "Proposition" },
  dsDocTypeOther: { en: "Other", fr: "Autre" },
  dsContextLabel: { en: "Additional context (optional)", fr: "Contexte additionnel (facultatif)" },
  dsContextPlaceholder: { en: "Jurisdiction, sector, stakeholder groups, or specific concerns…", fr: "Juridiction, secteur, groupes d'intervenants ou préoccupations particulières…" },
  dsRunBtn: { en: "Synthesize with GBA+", fr: "Synthétiser avec l'ACS+" },
  dsRunning: { en: "Synthesizing…", fr: "Synthèse en cours…" },
  dsClear: { en: "Clear", fr: "Effacer" },
  dsLoadSample: { en: "Load sample data", fr: "Charger des données d'exemple" },
  dsPasteFirst: { en: "Paste a document before synthesizing.", fr: "Collez un document avant de lancer la synthèse." },
  dsTooShort: { en: "Document is too short — paste at least a paragraph.", fr: "Le document est trop court — collez au moins un paragraphe." },
  dsPickDim: { en: "Select at least one GBA+ dimension below.", fr: "Sélectionnez au moins une dimension de l'ACS+ ci-dessous." },
  dsAnalysisFailed: { en: "Analysis failed: ", fr: "L'analyse a échoué : " },
  dsResultTitle: { en: "GBA+ Analysis", fr: "Analyse ACS+" },
  dsDimensionsWord: { en: "dimensions", fr: "dimensions" },
  dsCopy: { en: "Copy", fr: "Copier" },
  dsExecSummary: { en: "Executive synthesis", fr: "Synthèse exécutive" },
  dsRecActions: { en: "Recommended actions", fr: "Mesures recommandées" },

  // Twin shared
  twinTitleInput: { en: "Survey title…", fr: "Titre du sondage…" },
  twinDocTypePolicy: { en: "Policy survey", fr: "Sondage de politique" },
  twinDocTypeProgram: { en: "Program evaluation", fr: "Évaluation de programme" },
  twinDocTypeHr: { en: "Internal / HR (e.g., PSES-style)", fr: "Interne / RH (p. ex. type SAFF)" },
  twinDocTypeResearch: { en: "Research instrument", fr: "Instrument de recherche" },
  twinOriginalLink: { en: "Original Survey Testing Twin ↗", fr: "Jumeau de test original ↗" },
  navStart: { en: "Start", fr: "Démarrer" },
  navInput: { en: "Survey input", fr: "Saisie du sondage" },
  navData: { en: "Population data", fr: "Données démographiques" },
  navChecklist: { en: "GBA+ checklist", fr: "Liste de vérification ACS+" },
  navSimulate: { en: "Simulation", fr: "Simulation" },
  navCompliance: { en: "Compliance", fr: "Conformité" },
  navMissing: { en: "Who's missing", fr: "Qui est exclu" },
  navPlain: { en: "Plain language", fr: "Langage clair" },
  navBrief: { en: "Briefing note", fr: "Note de breffage" },
  navLibrary: { en: "Library", fr: "Bibliothèque" },

  // Start
  startPrompt: { en: "What are you here to do?", fr: "Que voulez-vous faire?" },
  startPrincipleTitle: { en: "What this tool does differently", fr: "Ce qui distingue cet outil" },
  startPrinciple: {
    en: "Every population statistic here cites a named, dated Statistics Canada / CRTC / Canadian Heritage release — never an invented number. Where no reliable open figure exists (e.g., religion, migration-status barriers), that gap is stated explicitly rather than filled in. The GBA+ checklist carries severity and clustering, not just pass/fail. Compliance gaps map to specific clauses and fixes, with a currency flag where the underlying law is in flux.",
    fr: "Chaque statistique démographique ici cite une publication nommée et datée de Statistique Canada, du CRTC ou de Patrimoine canadien — jamais un chiffre inventé. Lorsqu'aucune donnée ouverte fiable n'existe (p. ex. religion, obstacles liés au statut migratoire), cette lacune est indiquée explicitement plutôt que comblée arbitrairement. La liste de vérification de l'ACS+ comporte un niveau de gravité et un regroupement des obstacles, pas seulement une case à cocher. Les lacunes de conformité sont reliées à des articles précis et à des correctifs, avec un signal lorsque la loi sous-jacente est en évolution.",
  },
  startTip: {
    en: "this tool tracks version history through the Library tab rather than a live A/B split — save a snapshot each time you revise the instrument and compare them there.",
    fr: "cet outil suit l'historique des versions dans l'onglet Bibliothèque plutôt que par un fractionnement A/B en direct — enregistrez un instantané chaque fois que vous révisez l'instrument et comparez-les là.",
  },
  startTipLead: { en: "Tip:", fr: "Conseil :" },

  // Input
  inputSurveyLabel: { en: "Survey instrument text", fr: "Texte de l'instrument de sondage" },
  inputSurveyPlaceholder: { en: "Paste your survey questions (one per line works well — the checklist, simulation, and plain-language tabs all read from this text by default)…", fr: "Collez vos questions de sondage (une par ligne fonctionne bien — les onglets liste de vérification, simulation et langage clair lisent ce texte par défaut)…" },
  inputTargetFactors: { en: "Target identity factors for this survey", fr: "Facteurs identitaires ciblés pour ce sondage" },
  inputDrivesNote: { en: "These selections drive the Population Data, Checklist severity, and Simulation tabs.", fr: "Ces sélections influencent les onglets Données démographiques, gravité de la liste de vérification et Simulation." },
  twinLoadSample: { en: "Load sample data", fr: "Charger des données d'exemple" },

  // Population data
  dataSelectPrompt: { en: "Select factors to see what's already known", fr: "Sélectionnez des facteurs pour voir ce qui est déjà connu" },
  dataNoneSelected: { en: "Select one or more factors above to see their reference data.", fr: "Sélectionnez un ou plusieurs facteurs ci-dessus pour voir leurs données de référence." },
  dataOpenGap: { en: "Open-data gap: ", fr: "Lacune de données ouvertes : " },
  dataSources: { en: "Sources: ", fr: "Sources : " },
  dataFrameworks: { en: "Framework guidance: ", fr: "Orientation du cadre : " },
  dataIntersects: { en: "Intersects with", fr: "Recoupe" },
  dataChecklistItems: { en: "checklist item(s) — see GBA+ Checklist tab for clustering.", fr: "élément(s) de la liste de vérification — voir l'onglet Liste de vérification ACS+ pour le regroupement." },

  // Checklist
  checklistAlignedTo: { en: "GBA+ 5-step checklist, aligned to:", fr: "Liste de vérification en 5 étapes de l'ACS+, alignée sur :" },
  checklistAddressed: { en: "addressed", fr: "traités" },
  checklistHighGaps: { en: "high-severity gaps", fr: "lacunes de gravité élevée" },
  checklistCompoundTitle: { en: "Compounding barrier clusters detected", fr: "Regroupements d'obstacles cumulatifs détectés" },
  checklistCompoundLine1: { en: "appears across", fr: "apparaît dans" },
  checklistCompoundLine2: {
    en: "unaddressed items — these tend to compound for the same respondents (e.g., lower-literacy, lower-connectivity, or newcomer populations) rather than acting independently.",
    fr: "éléments non traités — ces obstacles ont tendance à se cumuler pour les mêmes répondants (p. ex. faible littératie, faible connectivité ou populations nouvellement arrivées) plutôt qu'à agir indépendamment.",
  },
  checklistStep: { en: "Step", fr: "Étape" },
  checklistRefStandards: { en: "References & standards", fr: "Références et normes" },
  checklistAlternative: { en: "Alternative if full implementation isn't feasible", fr: "Solution de rechange si la mise en œuvre complète n'est pas réalisable" },
  checklistQuickAction: { en: "Quick action", fr: "Mesure rapide" },
  checklistLow: { en: "Low", fr: "Faible" },
  checklistMedium: { en: "Medium", fr: "Moyenne" },
  checklistHigh: { en: "High", fr: "Élevée" },
  checklistEvidenceTitle: { en: "References, alternatives & quick actions", fr: "Références, solutions de rechange et mesures rapides" },

  // Simulation
  simGroundedTitle: { en: "How this simulation is grounded", fr: "Comment cette simulation est ancrée dans des données réelles" },
  simGroundedText: {
    en: "500 synthetic respondents are generated, but the underlying reach and completion rates are calibrated to the cited statistics below and to your current Checklist severity and Plain Language score — not invented. If delivery is online-only, reach is capped by the lowest connectivity rate among your selected target factors.",
    fr: "500 répondants synthétiques sont générés, mais les taux de portée et d'achèvement sous-jacents sont calibrés selon les statistiques citées ci-dessous ainsi que la gravité actuelle de votre liste de vérification et votre indice de langage clair — ils ne sont pas inventés. Si la diffusion est en ligne seulement, la portée est plafonnée par le taux de connectivité le plus faible parmi vos facteurs ciblés sélectionnés.",
  },
  simRunBtn: { en: "Run simulation (500 respondents)", fr: "Lancer la simulation (500 répondants)" },
  simRunning: { en: "Running…", fr: "Simulation en cours…" },
  simReach: { en: "Estimated reach", fr: "Portée estimée" },
  simCompletion: { en: "Completion (among reached)", fr: "Achèvement (parmi les rejoints)" },
  simEffective: { en: "Effective completion", fr: "Achèvement effectif" },
  simObserved: { en: "Observed (this run)", fr: "Observé (cette exécution)" },
  simAvgTime: { en: "Avg. completion time", fr: "Temps moyen d'achèvement" },
  simAvgQuality: { en: "Avg. data quality", fr: "Qualité moyenne des données" },
  simFunnelTitle: { en: "Completion funnel", fr: "Entonnoir d'achèvement" },
  simStarted: { en: "Started", fr: "Amorcé" },
  simReached: { en: "Reached (delivery-mode adjusted)", fr: "Rejoint (ajusté selon le mode de diffusion)" },
  simCompleted: { en: "Completed", fr: "Terminé" },
  simParamsUsed: { en: "Reach parameters used", fr: "Paramètres de portée utilisés" },
  simGapsNote: { en: "high-severity and", fr: "lacunes de gravité élevée et" },
  simGapsNote2: { en: "medium-severity checklist gaps were factored into the completion-rate penalty.", fr: "lacunes de gravité moyenne ont été intégrées à la pénalité du taux d'achèvement." },
  minUnit: { en: "min", fr: "min" },

  // Compliance
  compResolved: { en: "gaps resolved", fr: "lacunes résolues" },
  compFlaggedFrameworks: { en: "framework(s) flagged for currency", fr: "cadre(s) signalé(s) pour vérification d'actualité" },
  compVerifyCurrency: { en: "verify currency", fr: "vérifier l'actualité" },
  compLastVerified: { en: "last verified", fr: "dernière vérification" },
  compGapLabel: { en: "Gap:", fr: "Lacune :" },
  compClauseLabel: { en: "Clause:", fr: "Article :" },
  compFixLabel: { en: "Fix:", fr: "Correctif :" },

  // Who's missing
  missingDeliverySettings: { en: "Survey design — delivery & language settings", fr: "Conception du sondage — paramètres de diffusion et de langue" },
  missingOnline: { en: "Online delivery", fr: "Diffusion en ligne" },
  missingPaper: { en: "Paper option", fr: "Option papier" },
  missingPhone: { en: "Phone option", fr: "Option téléphone" },
  missingInPerson: { en: "In-person option", fr: "Option en personne" },
  missingLangMode: { en: "Language mode", fr: "Mode linguistique" },
  missingLangEnFr: { en: "English + French", fr: "Anglais + français" },
  missingLangEnOnly: { en: "English only", fr: "Anglais seulement" },
  missingLangFrOnly: { en: "French only", fr: "Français seulement" },
  missingLangMulti: { en: "English + French + other languages", fr: "Anglais + français + autres langues" },
  missingAccessible: { en: "An accessible alternate format is available", fr: "Un format substitut accessible est disponible" },
  missingOnlineFlagTitle: { en: "Online-only delivery, no offline alternative", fr: "Diffusion en ligne seulement, aucune solution hors ligne" },
  missingOnlineFlag1: {
    en: "≈5% of Canadians 15+ are non-internet-users — roughly",
    fr: "≈5 % des Canadiens de 15 ans et plus n'utilisent pas Internet — environ",
  },
  missingOnlineFlag1b: { en: "people.", fr: "personnes." },
  missingOnlineSrc1: { en: "(StatCan, CIUS, 2022 — 95% of Canadians 15+ used the internet)", fr: "(StatCan, EUTIC, 2022 — 95 % des Canadiens de 15 ans et plus utilisaient Internet)" },
  missingOnlineFlag2: {
    en: "Among seniors 75+, ≈28% are not online. Among First Nations reserve households, only ≈43% have 50/10 Mbps access.",
    fr: "Chez les aînés de 75 ans et plus, ≈28 % ne sont pas en ligne. Dans les ménages des réserves des Premières Nations, seulement ≈43 % ont un accès de 50/10 Mbps.",
  },
  missingOnlineSrc2: { en: "(CIUS, 2022; CRTC, mars 2023)", fr: "(EUTIC, 2022; CRTC, mars 2023)" },
  missingLangFlagTitle: { en: "Single official-language delivery", fr: "Diffusion dans une seule langue officielle" },
  missingLangFlag1: {
    en: "21.4% of Canadians have a mother tongue other than English or French — ≈",
    fr: "21,4 % des Canadiens ont une langue maternelle autre que l'anglais ou le français — ≈",
  },
  missingLangFlag1b: { en: "people.", fr: "personnes." },
  missingLangSrc1: { en: "(StatCan, 2021 Census)", fr: "(StatCan, recensement de 2021)" },
  missingLangFlag2: {
    en: "However, 98.1% of Canadians can converse in English and/or French (Canadian Heritage, 2021) — practical risk concentrates among recent newcomers and seniors with lower official-language fluency, not the full figure above.",
    fr: "Cependant, 98,1 % des Canadiens peuvent converser en anglais ou en français (Patrimoine canadien, 2021) — le risque concret se concentre chez les nouveaux arrivants et les aînés ayant une connaissance plus limitée des langues officielles, et non sur l'ensemble du chiffre ci-dessus.",
  },
  missingAccFlagTitle: { en: "No accessible alternate format", fr: "Aucun format substitut accessible" },
  missingAccFlag: {
    en: "27% of Canadians 15+ (≈8.0M people) report a disability, and accessibility/format barriers are among the most commonly cited survey-completion obstacles for this group.",
    fr: "27 % des Canadiens de 15 ans et plus (≈8,0 M de personnes) déclarent avoir une incapacité, et les obstacles liés à l'accessibilité ou au format sont parmi les obstacles les plus souvent cités pour l'achèvement de sondages au sein de ce groupe.",
  },
  missingAccFlagSrc: { en: "(StatCan, EICA, 2022)", fr: "(StatCan, ECI, 2022)" },
  missingAccFlag2: {
    en: "An exact count of respondents who specifically require an alternate format isn't published at the open-data level — treat this as a qualitative flag, not a precise figure.",
    fr: "Un dénombrement exact des répondants ayant spécifiquement besoin d'un format substitut n'est pas publié au niveau des données ouvertes — considérez ceci comme un signal qualitatif, non un chiffre précis.",
  },
  missingStructuralTitle: { en: "Structural gap regardless of design choices", fr: "Lacune structurelle, quels que soient les choix de conception" },
  missingStructuralText: {
    en: "≈183,000 people speak an Indigenous language regularly at home (StatCan, 2021 Census) — a small absolute number, but one where standard English/French delivery provides no support at all. Several major federal social surveys (e.g., CCHS) also structurally exclude people living on-reserve, full-time Canadian Forces members, and remote/institutional residents from their sampling frame — worth checking against your own frame.",
    fr: "≈183 000 personnes parlent régulièrement une langue autochtone à la maison (StatCan, recensement de 2021) — un nombre absolu modeste, mais pour lequel la diffusion standard en anglais ou en français n'offre aucun soutien. Plusieurs grandes enquêtes sociales fédérales (p. ex. l'ESCC) excluent aussi structurellement de leur cadre d'échantillonnage les personnes vivant dans une réserve, les membres à temps plein des Forces armées canadiennes et les résidents éloignés ou en établissement — à vérifier par rapport à votre propre cadre.",
  },
  missingNoFlags: { en: "No major design-driven exclusion flags based on current settings. Review the structural gap note above, which applies regardless of delivery choices.", fr: "Aucun signal majeur d'exclusion lié à la conception selon les paramètres actuels. Consultez la note sur la lacune structurelle ci-dessus, qui s'applique peu importe les choix de diffusion." },

  // Plain language
  plainTextLabel: { en: "Survey text to score", fr: "Texte du sondage à évaluer" },
  plainTextPlaceholder: { en: "Paste or edit the survey text to score (defaults to your Survey Input text)…", fr: "Collez ou modifiez le texte du sondage à évaluer (par défaut, le texte de l'onglet Saisie du sondage)…" },
  plainGradeLabel: { en: "Flesch–Kincaid grade level", fr: "Niveau scolaire Flesch–Kincaid" },
  plainTargetLabel: { en: "Target (general public)", fr: "Cible (grand public)" },
  plainGradeWord: { en: "Grade", fr: "Niveau" },
  plainWordsSentences: { en: "Words / sentences", fr: "Mots / phrases" },
  plainAccessible: { en: "Accessible — within Grade 8 target", fr: "Accessible — dans la cible de niveau 8" },
  plainModerate: { en: "Moderate — above target", fr: "Modéré — au-dessus de la cible" },
  plainComplex: { en: "Complex — well above target", fr: "Complexe — bien au-dessus de la cible" },
  plainSuggestBtn: { en: "Suggest plain-language rewrite", fr: "Proposer une reformulation en langage clair" },
  plainRewriting: { en: "Rewriting…", fr: "Reformulation en cours…" },
  plainSuggestedTitle: { en: "Suggested rewrite (Grade 8 target)", fr: "Reformulation proposée (cible : niveau 8)" },
  plainHeuristicNote: { en: "Flesch–Kincaid is a heuristic based on sentence length and syllable count — treat it as a screening signal, not a certified plain-language audit.", fr: "Flesch–Kincaid est une heuristique basée sur la longueur des phrases et le nombre de syllabes — considérez-la comme un signal de dépistage, et non un audit certifié de langage clair." },

  // Briefing note
  briefLabel: { en: "GBA+ summary — paste-ready", fr: "Sommaire ACS+ — prêt à coller" },
  briefPolishBtn: { en: "Polish for Cabinet/TB tone", fr: "Peaufiner pour le ton Cabinet/CT" },
  briefPolishing: { en: "Polishing…", fr: "Peaufinage en cours…" },
  briefCopy: { en: "Copy", fr: "Copier" },
  briefRegenerate: { en: "Regenerate from current state", fr: "Régénérer à partir de l'état actuel" },
  briefPolishFailed: { en: "[Polish failed: ", fr: "[Le peaufinage a échoué : " },

  // Tab descriptions
  dsDescription: {
    en: "Paste any policy, program, or report and run it through an AI-assisted GBA+ analysis across the identity factors you select — producing an executive summary, impact ratings, findings, and recommendations per dimension.",
    fr: "Collez une politique, un programme ou un rapport et soumettez-le à une analyse ACS+ assistée par l'IA selon les facteurs identitaires que vous sélectionnez — ce qui produit un sommaire exécutif, des cotes d'incidence, des constats et des recommandations par dimension.",
  },
  twinDescription: {
    en: "Test a survey instrument itself for GBA+ readiness: review real population data for your target groups, work through the 5-step GBA+ checklist, simulate reach and completion rates, check legal compliance gaps, estimate who's structurally excluded, score plain language, and generate a paste-ready briefing note.",
    fr: "Testez un instrument de sondage lui-même pour vérifier sa conformité à l'ACS+ : examinez des données démographiques réelles pour vos groupes ciblés, parcourez la liste de vérification de l'ACS+ en 5 étapes, simulez les taux de portée et d'achèvement, vérifiez les lacunes de conformité légale, estimez qui est structurellement exclu, évaluez le langage clair et générez une note de breffage prête à coller.",
  },
  libDescription: {
    en: "A standing reference library of the government legislation, policies, and guidance behind each step of the GBA+ checklist — with the quick actions and recommendations to act on them, organized by step rather than by survey.",
    fr: "Une bibliothèque de référence permanente des lois, politiques et orientations gouvernementales qui sous-tendent chaque étape de la liste de vérification de l'ACS+ — avec les mesures rapides et les recommandations pour y donner suite, organisées par étape plutôt que par sondage.",
  },

  // Library (reference library, by GBA+ step)
  libIntro: {
    en: "Every reference below also appears in context on the GBA+ Checklist tab. This view groups them by step so you can browse the full evidence base independently of any single survey.",
    fr: "Chaque référence ci-dessous apparaît également en contexte dans l'onglet Liste de vérification ACS+. Cette vue les regroupe par étape afin que vous puissiez parcourir l'ensemble des données probantes indépendamment d'un sondage en particulier.",
  },
  libStepRecommendation: { en: "Key recommendation for this step", fr: "Recommandation clé pour cette étape" },
  libSourcesForStep: { en: "Sources & policies for this step", fr: "Sources et politiques pour cette étape" },
  libItemsActions: { en: "Checklist items, quick actions & recommendations", fr: "Éléments de la liste, mesures rapides et recommandations" },
  libRecommendationLabel: { en: "Recommendation", fr: "Recommandation" },

  langToggleLabel: { en: "Language", fr: "Langue" },
};

function useT(lang) {
  return (key) => pick(UI[key], lang) || key;
}

/* ============================== GBA+ DIMENSIONS ============================== */
const DIMS = [
  { id: "gender", label: { en: "Gender & sex", fr: "Genre et sexe" }, desc: { en: "Women, men, non-binary", fr: "Femmes, hommes, personnes non binaires" }, icon: "♀♂", bg: T.greenBg, txt: T.greenTxt, on: true },
  { id: "race", label: { en: "Race & ethnicity", fr: "Race et origine ethnique" }, desc: { en: "Visible minorities", fr: "Minorités visibles" }, icon: "◉", bg: T.bluePill, txt: T.blueTxt, on: true },
  { id: "indigenous", label: { en: "Indigenous identity", fr: "Identité autochtone" }, desc: { en: "First Nations, Métis, Inuit", fr: "Premières Nations, Métis, Inuits" }, icon: "✦", bg: T.greenBg, txt: T.greenTxt, on: true },
  { id: "disability", label: { en: "Disability", fr: "Incapacité" }, desc: { en: "Physical, cognitive, mental", fr: "Physique, cognitive, mentale" }, icon: "⊕", bg: T.bluePill, txt: T.blueTxt, on: true },
  { id: "age", label: { en: "Age", fr: "Âge" }, desc: { en: "Youth, seniors, all cohorts", fr: "Jeunes, aînés, toutes les cohortes" }, icon: "◷", bg: T.purpleBg, txt: T.purpleTxt, on: true },
  { id: "lgbtq", label: { en: "Sexual orientation", fr: "Orientation sexuelle" }, desc: { en: "2SLGBTQ+ communities", fr: "Communautés bispirituelles et LGBTQ+" }, icon: "◈", bg: T.pinkBg, txt: T.pinkTxt, on: true },
  { id: "religion", label: { en: "Religion & faith", fr: "Religion et croyances" }, desc: { en: "Beliefs & spiritual practice", fr: "Croyances et pratiques spirituelles" }, icon: "✧", bg: T.amberBg, txt: T.amberTxt, on: false },
  { id: "income", label: { en: "Income & class", fr: "Revenu et classe sociale" }, desc: { en: "Socioeconomic status", fr: "Statut socioéconomique" }, icon: "◎", bg: T.amberBg, txt: T.amberTxt, on: true },
  { id: "education", label: { en: "Education & literacy", fr: "Éducation et littératie" }, desc: { en: "Literacy, credentials", fr: "Littératie, diplômes" }, icon: "◆", bg: T.purpleBg, txt: T.purpleTxt, on: false },
  { id: "geography", label: { en: "Geography", fr: "Géographie" }, desc: { en: "Rural, urban, remote", fr: "Rural, urbain, éloigné" }, icon: "◉", bg: T.coralBg, txt: T.coralTxt, on: true },
  { id: "language", label: { en: "Official language", fr: "Langue officielle" }, desc: { en: "English / French / other", fr: "Anglais / français / autre" }, icon: "◐", bg: T.coralBg, txt: T.coralTxt, on: false },
  { id: "migration", label: { en: "Migration status", fr: "Statut migratoire" }, desc: { en: "Newcomers, refugees, status", fr: "Nouveaux arrivants, réfugiés, statut" }, icon: "→", bg: T.bluePill, txt: T.blueTxt, on: false },
];

/* ============================== SHARED FRAMEWORK SOURCES ==============================
   Verified, current government / institutional sources. The GBA+ analysis throughout
   this tool draws on this set as its grounding framework. */
const SRC = {
  wageGuide: { label: { en: "WAGE — GBA Plus Step-by-Step Guide", fr: "FEGC — Guide étape par étape de l'ACS Plus" }, url: "https://women-gender-equality.canada.ca/en/gender-based-analysis-plus/resources/step-by-step-guide.html" },
  csps: { label: { en: "CSPS — Introduction to GBA Plus (INC101)", fr: "EFPC — Introduction à l'ACS Plus (INC101)" }, url: "https://catalogue.csps-efpc.gc.ca/product?catalog=INC101&cm_locale=en" },
  unWomen: { label: { en: "UN Women — Intersectionality Resource Guide and Toolkit", fr: "ONU Femmes — Guide de ressources et boîte à outils sur l'intersectionnalité" }, url: "https://www.unwomen.org/en/digital-library/publications/2022/01/intersectionality-resource-guide-and-toolkit" },
  censusProfile: { label: { en: "StatCan — Census Profile / data tables", fr: "StatCan — Profil du recensement / tableaux de données" }, url: "https://www12.statcan.gc.ca/census-recensement/index-eng.cfm" },
  genderResults: { label: { en: "WAGE — Gender Results Framework", fr: "FEGC — Cadre des résultats relatifs aux genres" }, url: "https://women-gender-equality.canada.ca/en/gender-results-framework.html" },
  dataViz: { label: { en: "StatCan — interactive data & visualization tools", fr: "StatCan — outils interactifs de données et de visualisation" }, url: "https://www160.statcan.gc.ca/index-eng.htm" },
  ocap: { label: { en: "FNIGC — OCAP® training", fr: "CGIPN — Formation OCAP®" }, url: "https://fnigc.ca/ocap-training/" },
  labourGlance: { label: { en: "StatCan — Labour Statistics at a Glance (71-222-X)", fr: "StatCan — Coup d'œil sur les statistiques du travail (71-222-X)" }, url: "https://www150.statcan.gc.ca/n1/pub/71-222-x/2021001/article/00004-eng.htm" },
  antiRacism: { label: { en: "Canada's Anti-Racism Strategy", fr: "Stratégie canadienne de lutte contre le racisme" }, url: "https://www.canada.ca/en/canadian-heritage/campaigns/anti-racism-strategy.html" },
  censusGuideCh7: { label: { en: "2021 Census Guide, Ch. 7 — Field Operations", fr: "Guide du recensement de 2021, chap. 7 — Opérations sur le terrain" }, url: "https://www12.statcan.gc.ca/census-recensement/2021/ref/98-304/2021001/chap7-eng.cfm" },
  crtcInternet: { label: { en: "CRTC — Internet services", fr: "CRTC — Services Internet" }, url: "https://crtc.gc.ca/eng/internet/internet.htm" },
  genderDiversityHub: { label: { en: "StatCan — Gender, diversity and inclusion statistics hub", fr: "StatCan — Carrefour statistique sur le genre, la diversité et l'inclusion" }, url: "https://www.statcan.gc.ca/en/subjects-start/gender_diversity_and_inclusion" },
  styleGuide: { label: { en: "Canada.ca Content Style Guide — plain language", fr: "Guide de rédaction du contenu de Canada.ca — langage clair" }, url: "https://www.canada.ca/en/treasury-board-secretariat/services/government-communications/canada-content-style-guide.html" },
  wcag: { label: { en: "W3C — WCAG 2.1", fr: "W3C — WCAG 2.1" }, url: "https://www.w3.org/TR/WCAG21/" },
};

/* ============================== REAL REFERENCE DATA ==============================
   Every statistic cites a named, dated Statistics Canada / CRTC / Canadian Heritage
   publication. Where no reliable open disaggregated figure exists, that gap is stated
   explicitly rather than estimated. `frameworks` links to the GBA+ guidance sources
   most relevant to that factor. */
const REFERENCE_DATA = {
  race: {
    stats: [
      { metric: { en: "Share of total population (racialized groups)", fr: "Part de la population totale (groupes racisés)" }, value: "26.5% (≈9.6M)", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "Core housing need, racialized population", fr: "Besoins impérieux en matière de logement, population racisée" }, value: "11.3% vs 7.7% overall", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
    ],
    note: { en: "Up from 22.3% in 2016; Statistics Canada now uses \"racialized population\" alongside the Employment Equity Act term \"visible minority\" in 2021 Census products.", fr: "En hausse par rapport à 22,3 % en 2016; Statistique Canada utilise désormais le terme « population racisée » en parallèle du terme « minorité visible » prévu par la Loi sur l'équité en matière d'emploi dans les produits du recensement de 2021." },
    frameworks: [SRC.antiRacism, SRC.censusProfile],
  },
  gender: {
    stats: [
      { metric: { en: "Disability rate, women+ (15+)", fr: "Taux d'incapacité, femmes+ (15 ans et plus)" }, value: "29.9%", source: { en: "StatCan, Canadian Survey on Disability (CSD), 2022", fr: "StatCan, Enquête canadienne sur l'incapacité (ECI), 2022" } },
      { metric: { en: "Disability rate, men+ (15+)", fr: "Taux d'incapacité, hommes+ (15 ans et plus)" }, value: "23.9%", source: { en: "StatCan, CSD, 2022", fr: "StatCan, ECI, 2022" } },
    ],
    note: { en: "Disability rates run higher for women+ across nearly every age band, which compounds with accessibility-related survey barriers.", fr: "Les taux d'incapacité sont plus élevés chez les femmes+ dans presque tous les groupes d'âge, ce qui se cumule aux obstacles liés à l'accessibilité des sondages." },
    frameworks: [SRC.genderResults, SRC.genderDiversityHub],
  },
  indigenous: {
    stats: [
      { metric: { en: "Share of total population", fr: "Part de la population totale" }, value: "5.0% (≈1.81M)", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "First Nations reserve households with 50/10 Mbps access", fr: "Ménages des réserves des Premières Nations avec accès 50/10 Mbps" }, value: "≈43%", source: { en: "CRTC, news release, Mar. 2023", fr: "CRTC, communiqué, mars 2023" } },
      { metric: { en: "Dwellings needing major repairs", fr: "Logements nécessitant des réparations majeures" }, value: "16.4% vs 5.7%", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "Average age", fr: "Âge moyen" }, value: "33.6 vs 41.8 yrs", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
    ],
    note: { en: "Connectivity infrastructure on-reserve lags the national average by a wide margin — a structural barrier independent of individual digital skill.", fr: "L'infrastructure de connectivité dans les réserves accuse un retard important par rapport à la moyenne nationale — un obstacle structurel indépendant des compétences numériques individuelles." },
    frameworks: [SRC.ocap, SRC.censusGuideCh7],
  },
  disability: {
    stats: [
      { metric: { en: "Overall disability rate, age 15+", fr: "Taux d'incapacité global, 15 ans et plus" }, value: "27.0% (≈8.0M)", source: { en: "StatCan, CSD, 2022", fr: "StatCan, ECI, 2022" } },
      { metric: { en: "Ages 15–24", fr: "15 à 24 ans" }, value: "20.1%", source: { en: "StatCan, CSD, 2022", fr: "StatCan, ECI, 2022" } },
      { metric: { en: "Ages 25–64", fr: "25 à 64 ans" }, value: "24.1%", source: { en: "StatCan, CSD, 2022", fr: "StatCan, ECI, 2022" } },
      { metric: { en: "Ages 65+", fr: "65 ans et plus" }, value: "40.4%", source: { en: "StatCan, CSD, 2022", fr: "StatCan, ECI, 2022" } },
    ],
    note: { en: "Up 4.7 points since 2017, driven mainly by mental-health disabilities in youth and working-age adults — relevant to cognitive-load and sustained-attention design choices.", fr: "En hausse de 4,7 points depuis 2017, principalement en raison des incapacités liées à la santé mentale chez les jeunes et les adultes en âge de travailler — pertinent pour la charge cognitive et l'attention soutenue requises par la conception du sondage." },
    frameworks: [SRC.wcag, SRC.censusGuideCh7],
  },
  age: {
    stats: [
      { metric: { en: "Internet use, age 65+", fr: "Utilisation d'Internet, 65 ans et plus" }, value: "82.6%", source: { en: "StatCan, Canadian Internet Use Survey (CIUS), 2022", fr: "StatCan, Enquête sur l'utilisation d'Internet (EUTIC), 2022" } },
      { metric: { en: "Internet use, age 75+", fr: "Utilisation d'Internet, 75 ans et plus" }, value: "72%", source: { en: "StatCan, CIUS, 2022", fr: "StatCan, EUTIC, 2022" } },
      { metric: { en: "Disability rate, age 65+", fr: "Taux d'incapacité, 65 ans et plus" }, value: "40.4%", source: { en: "StatCan, CSD, 2022", fr: "StatCan, ECI, 2022" } },
    ],
    note: { en: "Seniors are the fastest-growing group of new internet users, but a meaningful minority — especially 75+ — remain offline or low-skill users.", fr: "Les aînés forment le groupe de nouveaux utilisateurs d'Internet qui croît le plus rapidement, mais une minorité importante — surtout les 75 ans et plus — demeure hors ligne ou peu à l'aise avec le numérique." },
    frameworks: [SRC.dataViz],
  },
  lgbtq: {
    stats: [
      { metric: { en: "Share of population 15+ identifying 2SLGBTQ+", fr: "Part de la population de 15 ans et plus s'identifiant comme bispirituelle ou LGBTQ+" }, value: "4.4% (≈1.3M)", source: { en: "StatCan, Canadian Community Health Survey (CCHS), pooled 2019–2021", fr: "StatCan, Enquête sur la santé dans les collectivités canadiennes (ESCC), 2019-2021 combinées" } },
      { metric: { en: "Ages 15–24", fr: "15 à 24 ans" }, value: "10.5%", source: { en: "StatCan, CCHS, 2019–2021", fr: "StatCan, ESCC, 2019-2021" } },
      { metric: { en: "Ages 65+", fr: "65 ans et plus" }, value: "1.3%", source: { en: "StatCan, CCHS, 2019–2021", fr: "StatCan, ESCC, 2019-2021" } },
      { metric: { en: "Trans or non-binary, age 15+", fr: "Personnes trans ou non binaires, 15 ans et plus" }, value: "0.33%", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
    ],
    note: { en: "The CCHS sampling frame excludes people living on-reserve, full-time Canadian Forces members, and institutional/remote residents — a coverage gap worth flagging on its own (see Who's Missing).", fr: "Le cadre d'échantillonnage de l'ESCC exclut les personnes vivant dans une réserve, les membres à temps plein des Forces armées canadiennes et les résidents en établissement ou en région éloignée — une lacune de couverture à signaler en soi (voir Qui est exclu)." },
    frameworks: [SRC.unWomen, SRC.genderDiversityHub],
  },
  religion: {
    stats: [],
    note: { en: "Religion is collected on the long-form Census, but open, survey-methodology-relevant crosstabs (e.g., barrier rates by faith group) are not published at the open-data level. Treat findings for this factor as qualitative until linked microdata is available.", fr: "La religion est recueillie dans le questionnaire détaillé du recensement, mais des tableaux croisés ouverts pertinents pour la méthodologie d'enquête (p. ex. taux d'obstacles par groupe confessionnel) ne sont pas publiés au niveau des données ouvertes. Considérez les constats pour ce facteur comme qualitatifs jusqu'à ce que des microdonnées couplées soient disponibles." },
    frameworks: [SRC.unWomen],
  },
  income: {
    stats: [
      { metric: { en: "Senior internet use, household income <$20k", fr: "Utilisation d'Internet par les aînés, revenu du ménage <20 000 $" }, value: "54%", source: { en: "StatCan, General Social Survey, 2016", fr: "StatCan, Enquête sociale générale, 2016" } },
      { metric: { en: "Senior internet use, household income $100k+", fr: "Utilisation d'Internet par les aînés, revenu du ménage 100 000 $+" }, value: "79%", source: { en: "StatCan, General Social Survey, 2016", fr: "StatCan, Enquête sociale générale, 2016" } },
    ],
    note: { en: "Income-linked digital access data for seniors hasn't been refreshed federally since 2016 — flag this as a known data-currency gap if relying on it for a submission.", fr: "Les données sur l'accès numérique des aînés liées au revenu n'ont pas été mises à jour au fédéral depuis 2016 — signalez cette lacune d'actualité des données si vous vous y appuyez pour une présentation." },
    frameworks: [SRC.labourGlance],
  },
  education: {
    stats: [
      { metric: { en: "Adults (16–65) at/below Literacy Level 1", fr: "Adultes (16 à 65 ans) au niveau de littératie 1 ou moins" }, value: "19%", source: { en: "StatCan / OECD, PIAAC, 2022–23", fr: "StatCan / OCDE, PEICA, 2022-2023" } },
      { metric: { en: "Adults at/below Numeracy Level 1", fr: "Adultes au niveau de numératie 1 ou moins" }, value: "20.1%", source: { en: "OECD, PIAAC, 2022–23", fr: "OCDE, PEICA, 2022-2023" } },
      { metric: { en: "Adults at Literacy Level 3+", fr: "Adultes au niveau de littératie 3 ou plus" }, value: "51%", source: { en: "StatCan / OECD, PIAAC, 2022–23", fr: "StatCan / OCDE, PEICA, 2022-2023" } },
    ],
    note: { en: "Roughly 1 in 5 working-age Canadians reads below the level needed to reliably complete a Level-3-complexity survey instrument.", fr: "Environ 1 Canadien en âge de travailler sur 5 lit sous le niveau requis pour remplir de façon fiable un instrument de sondage de complexité de niveau 3." },
    frameworks: [SRC.labourGlance, SRC.styleGuide],
  },
  geography: {
    stats: [
      { metric: { en: "Urban household 50/10 Mbps access", fr: "Accès 50/10 Mbps des ménages urbains" }, value: "≈99%", source: { en: "CRTC, news release, Mar. 2023", fr: "CRTC, communiqué, mars 2023" } },
      { metric: { en: "Rural household 50/10 Mbps access", fr: "Accès 50/10 Mbps des ménages ruraux" }, value: "≈62%", source: { en: "CRTC, news release, Mar. 2023", fr: "CRTC, communiqué, mars 2023" } },
      { metric: { en: "First Nations reserve access", fr: "Accès dans les réserves des Premières Nations" }, value: "≈43%", source: { en: "CRTC, news release, Mar. 2023", fr: "CRTC, communiqué, mars 2023" } },
    ],
    note: { en: "The CRTC's own Communications Monitoring Report shows the urban/rural gap holding roughly steady year over year despite federal broadband-fund spending.", fr: "Le propre Rapport de surveillance des communications du CRTC montre que l'écart urbain-rural demeure relativement stable d'une année à l'autre malgré les dépenses du fonds fédéral pour la large bande." },
    frameworks: [SRC.crtcInternet, SRC.dataViz],
  },
  language: {
    stats: [
      { metric: { en: "English mother tongue", fr: "Langue maternelle anglaise" }, value: "54.9%", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "French mother tongue", fr: "Langue maternelle française" }, value: "19.6%", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "Neither official language as mother tongue", fr: "Aucune langue officielle comme langue maternelle" }, value: "21.4% (≈7.8M)", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "English–French bilingual", fr: "Bilingue anglais-français" }, value: "18.0% (≈6.6M)", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
      { metric: { en: "Indigenous language spoken regularly at home", fr: "Langue autochtone parlée régulièrement à la maison" }, value: "≈183,000", source: { en: "StatCan, 2021 Census", fr: "StatCan, recensement de 2021" } },
    ],
    note: { en: "98.1% of Canadians can converse in English and/or French (Canadian Heritage, 2021) — the practical equity risk concentrates in the gap between mother tongue and functional fluency, not the full non-official-language population.", fr: "98,1 % des Canadiens peuvent converser en anglais ou en français (Patrimoine canadien, 2021) — le risque réel pour l'équité se concentre dans l'écart entre la langue maternelle et la maîtrise fonctionnelle, et non sur l'ensemble de la population de langue non officielle." },
    frameworks: [SRC.censusProfile],
  },
  migration: {
    stats: [],
    note: { en: "Immigration/admission-category data exists at Census and IRCC levels, but isn't published as a direct crosstab against survey-completion or literacy barriers. Recent-arrival status is a reasonable proxy risk factor pending better linked data.", fr: "Les données sur l'immigration et la catégorie d'admission existent au niveau du recensement et d'IRCC, mais ne sont pas publiées en tableau croisé direct avec les obstacles à l'achèvement des sondages ou à la littératie. Le statut de nouvel arrivant est un facteur de risque indicatif raisonnable en attendant de meilleures données couplées." },
    frameworks: [SRC.unWomen, SRC.antiRacism],
  },
};

const STRUCTURAL_TAGS = {
  digital: { en: "Digital access", fr: "Accès numérique" },
  literacy: { en: "Plain language", fr: "Langage clair" },
  intersectionality: { en: "Disaggregated analysis", fr: "Analyse désagrégée" },
};

/* ============================== GBA+ 5-STEP CHECKLIST ==============================
   Aligned to WAGE's GBA Plus Step-by-Step Guide stages. */
const GBA_STEPS = [
  { en: "Identify and frame the issue", fr: "Cerner et définir l'enjeu" },
  { en: "Gather data through an intersectional lens", fr: "Recueillir des données selon une perspective intersectionnelle" },
  { en: "Develop options and analyze differential impacts", fr: "Élaborer des options et analyser les répercussions différentielles" },
  { en: "Make recommendations and finalize the proposal", fr: "Formuler des recommandations et finaliser la proposition" },
  { en: "Monitor, evaluate, and report", fr: "Surveiller, évaluer et rendre compte" },
];

/* One synthesized, step-level recommendation — distinct from the per-item quick actions
   and recommendations below, which stay specific to each checklist item. */
const STEP_RECOMMENDATIONS = [
  { en: "Before drafting a single question, write down who this is for and who could be missed — then check that against real population data, not assumptions.", fr: "Avant de rédiger la moindre question, notez à qui s'adresse le sondage et qui pourrait être oublié — puis validez cela avec des données démographiques réelles, et non des suppositions." },
  { en: "Treat self-identification categories and real population profiles as inputs to question design, not a check done after the fact.", fr: "Considérez les catégories d'auto-identification et les profils démographiques réels comme des intrants à la conception des questions, et non une vérification effectuée après coup." },
  { en: "Equivalent French/English reading level, an offline option, and an accessible format aren't optional add-ons — build them in before the pilot, not after.", fr: "Un niveau de lecture équivalent en français et en anglais, une option hors ligne et un format accessible ne sont pas des ajouts facultatifs — intégrez-les avant le projet pilote, pas après." },
  { en: "Decide your disaggregation thresholds and small-population suppression rules before you collect a single response, not when you're writing the report.", fr: "Déterminez vos seuils de désagrégation et vos règles de suppression pour les petites populations avant de recueillir la moindre réponse, et non au moment de rédiger le rapport." },
  { en: "Build the disaggregated monitoring view into your standard reporting cycle from day one — retrofitting it later usually means the early data was never broken down at all.", fr: "Intégrez la vue de surveillance désagrégée à votre cycle de rapport standard dès le départ — l'ajouter plus tard signifie habituellement que les premières données n'ont jamais été ventilées." },
];

const CHECKLIST_ITEMS = [
  { id: "c1", step: 1, text: { en: "The survey's purpose and target population(s) are explicitly defined, including which identity groups are expected to respond.", fr: "L'objectif du sondage et la ou les populations ciblées sont explicitement définis, y compris les groupes identitaires dont on attend des réponses." }, clusters: ["intersectionality"] },
  { id: "c2", step: 1, text: { en: "Consent and privacy language is written in plain language and explains exactly how identity data will be used.", fr: "Le texte sur le consentement et la vie privée est rédigé en langage clair et explique précisément comment les données identitaires seront utilisées." }, clusters: ["literacy", "disability"] },
  { id: "c3", step: 2, text: { en: "Demographic questions use inclusive, self-identification categories rather than binary-only options.", fr: "Les questions démographiques utilisent des catégories d'auto-identification inclusives plutôt que des options binaires seulement." }, clusters: ["gender", "lgbtq"] },
  { id: "c4", step: 2, text: { en: "A real population data profile (Census / CSD / PIAAC / CIUS) was reviewed for each target group before drafting questions.", fr: "Un profil de données démographiques réel (recensement / ECI / PEICA / EUTIC) a été examiné pour chaque groupe ciblé avant la rédaction des questions." }, clusters: ["intersectionality"] },
  { id: "c5", step: 3, text: { en: "The survey is available in both English and French at an equivalent reading level and structure.", fr: "Le sondage est offert en anglais et en français, avec un niveau de lecture et une structure équivalents." }, clusters: ["language", "literacy"] },
  { id: "c6", step: 3, text: { en: "At least one accessible format (screen-reader compatible, large print, plain text) is available.", fr: "Au moins un format accessible (compatible avec un lecteur d'écran, gros caractères, texte simple) est disponible." }, clusters: ["disability"] },
  { id: "c7", step: 3, text: { en: "The survey can be completed without a personal internet connection (paper, phone, or in-person option).", fr: "Le sondage peut être rempli sans connexion Internet personnelle (option papier, téléphone ou en personne)." }, clusters: ["digital", "geography", "indigenous", "income"] },
  { id: "c8", step: 3, text: { en: "Reading level has been measured and targeted to roughly Grade 8 or below for general-public items.", fr: "Le niveau de lecture a été mesuré et ciblé à environ la 8e année ou moins pour les éléments destinés au grand public." }, clusters: ["literacy", "education", "migration"] },
  { id: "c9", step: 3, text: { en: "Estimated completion time and cognitive load were tested with at least one member of an underrepresented group.", fr: "Le temps d'achèvement estimé et la charge cognitive ont été testés auprès d'au moins un membre d'un groupe sous-représenté." }, clusters: ["disability", "age", "intersectionality"] },
  { id: "c10", step: 4, text: { en: "A disaggregated analysis plan (by which identity factors, at what threshold) is defined before data collection begins.", fr: "Un plan d'analyse désagrégée (selon quels facteurs identitaires, à quel seuil) est défini avant le début de la collecte de données." }, clusters: ["intersectionality"] },
  { id: "c11", step: 4, text: { en: "Small-population suppression rules are defined in advance to protect respondent privacy without erasing the group from results.", fr: "Des règles de suppression pour les petites populations sont définies à l'avance afin de protéger la vie privée des répondants sans effacer le groupe des résultats." }, clusters: ["indigenous", "lgbtq", "migration"] },
  { id: "c12", step: 5, text: { en: "The monitoring/reporting plan tracks completion and quality rates broken down by identity factor, not just in aggregate.", fr: "Le plan de surveillance et de rapport suit les taux d'achèvement et de qualité ventilés par facteur identitaire, et non seulement de façon globale." }, clusters: ["intersectionality"] },
];

/* ---- Checklist evidence panels: references & standards, alternatives, quick actions ----
   Grounded in the GBA+ guidance sources listed in SRC above. */
const CHECKLIST_RESOURCES = {
  c1: {
    references: [SRC.wageGuide, SRC.csps],
    alternative: { en: "If a full GBA+ isn't feasible on this cycle, document the intended population and known data gaps in the project charter so the next cycle can build on it.", fr: "Si une ACS+ complète n'est pas réalisable durant ce cycle, consignez la population visée et les lacunes de données connues dans la charte de projet afin que le prochain cycle puisse s'appuyer sur ce travail." },
    quickAction: { en: "Add a one-paragraph \"who this is for\" statement to the survey's introduction or instructions.", fr: "Ajoutez un court paragraphe « à qui s'adresse ce sondage » à l'introduction ou aux instructions." },
  },
  c2: {
    references: [SRC.styleGuide],
    alternative: { en: "Use a short consent banner with a \"learn more\" link to the full notice, rather than a long paragraph up front.", fr: "Utilisez un court bandeau de consentement avec un lien « en savoir plus » vers l'avis complet, plutôt qu'un long paragraphe d'emblée." },
    quickAction: { en: "Run your consent text through the Plain Language tab and target Grade 8.", fr: "Passez votre texte de consentement dans l'onglet Langage clair et visez la 8e année." },
  },
  c3: {
    references: [SRC.genderDiversityHub],
    alternative: { en: "If a write-in field isn't feasible, offer \"man/boy, woman/girl, or another gender (please specify)\" rather than a binary-only choice.", fr: "Si un champ de saisie libre n'est pas réalisable, offrez « homme/garçon, femme/fille ou un autre genre (veuillez préciser) » plutôt qu'un choix binaire seulement." },
    quickAction: { en: "Add a \"prefer not to answer\" option alongside any identity question.", fr: "Ajoutez une option « préfère ne pas répondre » à toute question identitaire." },
  },
  c4: {
    references: [SRC.censusProfile, SRC.dataViz],
    alternative: { en: "If no published table fits exactly, use the closest proxy variable and note the substitution in your methodology.", fr: "Si aucun tableau publié ne convient exactement, utilisez la variable de substitution la plus proche et notez la substitution dans votre méthodologie." },
    quickAction: { en: "Use this tool's Population Data tab for each target factor before finalizing question wording.", fr: "Utilisez l'onglet Données démographiques de cet outil pour chaque facteur ciblé avant de finaliser le libellé des questions." },
  },
  c5: {
    references: [{ label: { en: "Official Languages Act, Part IV", fr: "Loi sur les langues officielles, partie IV" }, url: "https://laws-lois.justice.gc.ca/eng/acts/o-3.01/page-4.html" }],
    alternative: { en: "If independent FR drafting isn't resourced, at minimum have a francophone reviewer assess reading level, not just accuracy.", fr: "Si la rédaction indépendante en français n'est pas possible, demandez au minimum à un réviseur francophone d'évaluer le niveau de lecture, pas seulement l'exactitude." },
    quickAction: { en: "Compare both versions question-by-question for reading level and missing response options.", fr: "Comparez les deux versions question par question pour le niveau de lecture et les options de réponse manquantes." },
  },
  c6: {
    references: [SRC.wcag, SRC.censusGuideCh7],
    alternative: { en: "If a fully screen-reader-optimized build isn't ready, ship a plain-text/HTML fallback alongside the main format as an interim step.", fr: "Si une version entièrement optimisée pour les lecteurs d'écran n'est pas prête, fournissez une version de repli en texte simple ou HTML aux côtés du format principal comme mesure provisoire." },
    quickAction: { en: "Confirm at minimum one alternate format (plain text, large print, or HTML) before fielding.", fr: "Confirmez au moins un format substitut (texte simple, gros caractères ou HTML) avant la diffusion." },
  },
  c7: {
    references: [SRC.censusGuideCh7, SRC.crtcInternet],
    alternative: { en: "If a full phone-administered option isn't feasible, a mail-back paper form alone still closes most of the access gap for offline respondents.", fr: "Si une option téléphonique complète n'est pas réalisable, un formulaire papier à retourner par la poste comble déjà la majeure partie de l'écart d'accès pour les répondants hors ligne." },
    quickAction: { en: "Add a toll-free line or paper mail-back option sized to the populations flagged in Who's Missing.", fr: "Ajoutez une ligne sans frais ou une option papier par la poste à l'échelle des populations signalées dans Qui est exclu." },
  },
  c8: {
    references: [SRC.styleGuide],
    alternative: { en: "If a full rewrite is too costly pre-launch, prioritize simplifying the consent text and the first three questions — where drop-off is highest.", fr: "Si une réécriture complète est trop coûteuse avant le lancement, priorisez la simplification du texte de consentement et des trois premières questions — où l'abandon est le plus élevé." },
    quickAction: { en: "Run the instrument through the Plain Language tab and apply the AI rewrite suggestion.", fr: "Passez l'instrument dans l'onglet Langage clair et appliquez la reformulation proposée par l'IA." },
  },
  c9: {
    references: [SRC.csps, SRC.unWomen],
    alternative: { en: "If formal usability testing isn't possible, an informal read-aloud session with 2–3 staff from an employee network (e.g., a disability or newcomer network) still surfaces major issues.", fr: "Si des essais d'utilisabilité formels ne sont pas possibles, une séance informelle de lecture à voix haute avec 2 à 3 membres d'un réseau d'employés (p. ex. réseau des personnes en situation de handicap ou des nouveaux arrivants) permet déjà de relever les problèmes majeurs." },
    quickAction: { en: "Recruit 3–5 testers from your target factors via existing community or employee-network contacts before fielding.", fr: "Recrutez de 3 à 5 testeurs parmi vos facteurs ciblés par l'entremise de contacts communautaires ou de réseaux d'employés existants avant la diffusion." },
  },
  c10: {
    references: [SRC.genderResults, SRC.unWomen],
    alternative: { en: "If full disaggregation isn't powered by your sample size, pre-commit to reporting at least one priority factor in full and others qualitatively.", fr: "Si la taille de l'échantillon ne permet pas une désagrégation complète, engagez-vous d'avance à présenter au moins un facteur prioritaire en détail et les autres de façon qualitative." },
    quickAction: { en: "Pre-register which variables and thresholds you'll disaggregate by before collecting any data.", fr: "Enregistrez d'avance les variables et les seuils de désagrégation avant toute collecte de données." },
  },
  c11: {
    references: [SRC.ocap],
    alternative: { en: "Where a precise threshold isn't set by policy, Statistics Canada's general practice of rounding or suppressing small cell counts (rather than omitting the group) is a reasonable default.", fr: "Lorsqu'aucun seuil précis n'est fixé par une politique, la pratique générale de Statistique Canada consistant à arrondir ou à supprimer les petits effectifs (plutôt que d'omettre le groupe) constitue une norme par défaut raisonnable." },
    quickAction: { en: "Set a minimum cell size (e.g., n=5 or n=10) below which results are reported as a range or suppressed — never silently dropped.", fr: "Fixez un effectif minimal (p. ex. n=5 ou n=10) sous lequel les résultats sont présentés sous forme de plage ou supprimés — jamais omis silencieusement." },
  },
  c12: {
    references: [SRC.genderResults, SRC.dataViz],
    alternative: { en: "If a live dashboard isn't available, a recurring manual cross-tab in the existing reporting cycle achieves the same monitoring intent.", fr: "Si un tableau de bord en direct n'est pas disponible, un tableau croisé manuel récurrent dans le cycle de rapport existant permet d'atteindre le même objectif de surveillance." },
    quickAction: { en: "Add a recurring line item: completion and quality rate by each GBA+ factor, reviewed every reporting cycle.", fr: "Ajoutez un point récurrent : taux d'achèvement et de qualité par facteur de l'ACS+, examiné à chaque cycle de rapport." },
  },
};

/* ============================== COMPLIANCE / LEGAL HOOK MAP ============================== */
const FRAMEWORKS = [
  {
    id: "pipeda",
    name: { en: "PIPEDA (Part 1)", fr: "LPRPDE (partie 1)" },
    regulator: { en: "Office of the Privacy Commissioner of Canada (OPC)", fr: "Commissariat à la protection de la vie privée du Canada (CPVP)" },
    lastVerified: { en: "Dec 2025", fr: "déc. 2025" }, flagged: true,
    flagText: { en: "Bill C-27 (the proposed CPPA replacing PIPEDA Part 1) died on the order paper in Jan. 2025. A successor bill was anticipated in late 2025 / early 2026 but had not been confirmed passed as of last verification — PIPEDA remains in force in the meantime. Re-check before citing in a submission.", fr: "Le projet de loi C-27 (la LPVPC proposée pour remplacer la partie 1 de la LPRPDE) est mort au Feuilleton en janvier 2025. Un projet de loi successeur était attendu à la fin de 2025 ou au début de 2026, mais son adoption n'était pas confirmée au moment de la dernière vérification — la LPRPDE demeure en vigueur entre-temps. Vérifiez à nouveau avant de citer ceci dans une présentation." },
    gaps: [
      { gap: { en: "Collecting exact birthdate + postal code + ethnicity together without a documented purpose", fr: "Collecte de la date de naissance exacte, du code postal et de l'origine ethnique ensemble sans objectif documenté" }, clause: { en: "PIPEDA Sch. 1, Principles 4.3 (Consent) & 4.4 (Limiting Collection)", fr: "LPRPDE, annexe 1, principes 4.3 (consentement) et 4.4 (limitation de la collecte)" }, fix: { en: "Collect an age range and broader region instead of exact identifiers unless precision is analytically required; state the purpose at the point of collection.", fr: "Recueillez une tranche d'âge et une région plus large plutôt que des identifiants exacts, sauf si la précision est analytiquement nécessaire; indiquez l'objectif au moment de la collecte." } },
      { gap: { en: "No plain-language explanation of how identity data will be used or shared", fr: "Aucune explication en langage clair sur l'utilisation ou le partage des données identitaires" }, clause: { en: "PIPEDA Sch. 1, Principle 4.3.2 (meaningful consent)", fr: "LPRPDE, annexe 1, principe 4.3.2 (consentement valable)" }, fix: { en: "Add a 2–3 sentence plain-language data-use statement immediately before the demographic section.", fr: "Ajoutez une déclaration de 2 à 3 phrases en langage clair sur l'utilisation des données, juste avant la section démographique." } },
    ],
  },
  {
    id: "loi25",
    name: { en: "Loi 25 (Quebec)", fr: "Loi 25 (Québec)" },
    regulator: { en: "Commission d'accès à l'information (CAI)", fr: "Commission d'accès à l'information (CAI)" },
    lastVerified: { en: "Sep 2024 — fully phased in", fr: "sept. 2024 — entièrement en vigueur" }, flagged: false,
    gaps: [
      { gap: { en: "No named privacy officer published for the survey or initiative", fr: "Aucun responsable de la protection des renseignements personnels nommé publiquement pour le sondage ou l'initiative" }, clause: { en: "Loi 25, ss. 3.1 & 3.3", fr: "Loi 25, art. 3.1 et 3.3" }, fix: { en: "Publish a named contact (or role) responsible for personal information on the survey landing page or consent screen.", fr: "Publiez le nom (ou le titre) de la personne responsable des renseignements personnels sur la page d'accueil du sondage ou l'écran de consentement." } },
      { gap: { en: "No privacy impact assessment on file for sensitive GBA+ variables (disability, sexual orientation, Indigenous identity)", fr: "Aucune évaluation des facteurs relatifs à la vie privée au dossier pour les variables sensibles de l'ACS+ (incapacité, orientation sexuelle, identité autochtone)" }, clause: { en: "Loi 25, ss. 3.3 & 63.5", fr: "Loi 25, art. 3.3 et 63.5" }, fix: { en: "Complete and file a short PIA before launch for any sensitive identity variable collected from Quebec respondents.", fr: "Remplissez et déposez une courte ÉFVP avant le lancement pour toute variable identitaire sensible recueillie auprès de répondants québécois." } },
    ],
  },
  {
    id: "mria",
    name: { en: "Code MRIA / CRIC Code of Conduct", fr: "Code de l'ARIM / Code de déontologie du CRIC" },
    regulator: { en: "Canadian Research Insights Council (CRIC, formerly MRIA)", fr: "Conseil de recherche et d'intelligence marketing canadien (CRIC, anciennement l'ARIM)" },
    lastVerified: { en: "2023", fr: "2023" }, flagged: false,
    gaps: [
      { gap: { en: "No extra safeguard for respondents who may belong to a vulnerable population (minors, persons with diminished capacity)", fr: "Aucune mesure de protection additionnelle pour les répondants susceptibles d'appartenir à une population vulnérable (mineurs, personnes ayant une capacité réduite)" }, clause: { en: "CRIC Code of Conduct, vulnerable-respondent provisions", fr: "Code de déontologie du CRIC, dispositions sur les répondants vulnérables" }, fix: { en: "Add a comprehension check and an easy, repeated opt-out at every question, not only at survey start.", fr: "Ajoutez une vérification de la compréhension et une option de retrait facile et répétée à chaque question, pas seulement au début du sondage." } },
    ],
  },
  {
    id: "tcps2",
    name: { en: "EPTC 2 / TCPS 2", fr: "ÉPTC 2" },
    regulator: { en: "CIHR · NSERC · SSHRC (Panel on Research Ethics)", fr: "IRSC · CRSNG · CRSH (Groupe en éthique de la recherche)" },
    lastVerified: { en: "2022 edition", fr: "édition de 2022" }, flagged: false,
    gaps: [
      { gap: { en: "Survey targets a First Nations, Inuit, or Métis community without documented REB review", fr: "Le sondage cible une communauté des Premières Nations, inuite ou métisse sans examen documenté par un CÉR" }, clause: { en: "TCPS 2, Chapter 9 — Research Involving the First Nations, Inuit, and Métis Peoples of Canada", fr: "ÉPTC 2, chapitre 9 — La recherche visant les Premières Nations, les Inuits et les Métis du Canada" }, fix: { en: "Route the survey through institutional REB review and community-governance consultation (e.g., OCAP® principles) before fielding.", fr: "Faites examiner le sondage par le CÉR de l'établissement et consultez la gouvernance communautaire (p. ex. principes OCAP®) avant la diffusion." } },
    ],
  },
  {
    id: "ola",
    name: { en: "Official Languages Act (LLO)", fr: "Loi sur les langues officielles (LLO)" },
    regulator: { en: "Office of the Commissioner of Official Languages (OCOL)", fr: "Commissariat aux langues officielles (CLO)" },
    lastVerified: { en: "Jun 2023 — post Bill C-13", fr: "juin 2023 — après le projet de loi C-13" }, flagged: true,
    flagText: { en: "Bill C-13 (2023) strengthened Part IV/VII obligations and OCOL's enforcement powers. Confirm current OCOL interpretation bulletins before citing a specific clause in a Cabinet or Treasury Board submission.", fr: "Le projet de loi C-13 (2023) a renforcé les obligations des parties IV et VII ainsi que les pouvoirs d'application du CLO. Confirmez les bulletins d'interprétation actuels du CLO avant de citer un article précis dans une présentation au Cabinet ou au Conseil du Trésor." },
    gaps: [
      { gap: { en: "French version is a literal translation with a different reading level or sentence structure than the English version", fr: "La version française est une traduction littérale dont le niveau de lecture ou la structure des phrases diffère de la version anglaise" }, clause: { en: "OLA Part IV (Communications and services to the public)", fr: "LLO, partie IV (Communications avec le public et prestation des services)" }, fix: { en: "Have the French version independently drafted or reviewed for equivalent plain-language grade level — see Bilingual Equity tab.", fr: "Faites rédiger ou réviser la version française de façon indépendante pour un niveau de langage clair équivalent." } },
      { gap: { en: "A response option exists in one official language but not the other", fr: "Une option de réponse existe dans une langue officielle mais pas dans l'autre" }, clause: { en: "OLA Part IV", fr: "LLO, partie IV" }, fix: { en: "Run a line-by-line response-option parity check before fielding.", fr: "Effectuez une vérification ligne par ligne de la parité des options de réponse avant la diffusion." } },
    ],
  },
];

/* ============================== TASK ENTRY TILES ============================== */
const TASK_TILES = [
  { id: "design", title: { en: "I'm designing a new survey", fr: "Je conçois un nouveau sondage" }, desc: { en: "Start from the GBA+ checklist and population data before you write questions.", fr: "Commencez par la liste de vérification de l'ACS+ et les données démographiques avant de rédiger les questions." }, goTo: "data" },
  { id: "review", title: { en: "I'm reviewing an existing survey", fr: "Je révise un sondage existant" }, desc: { en: "Paste your instrument and run it through the checklist, simulation, and plain-language check.", fr: "Collez votre instrument et passez-le dans la liste de vérification, la simulation et le contrôle du langage clair." }, goTo: "input" },
  { id: "submission", title: { en: "I'm preparing a policy submission", fr: "Je prépare une présentation de politique" }, desc: { en: "Jump to compliance, exclusion estimates, and the briefing-note generator.", fr: "Allez directement à la conformité, aux estimations d'exclusion et au générateur de note de breffage." }, goTo: "compliance" },
];

/* ============================== SAMPLE / DEMO DATA ==============================
   Fictional content for demo purposes only — no real survey, policy, or respondent data. */
const SAMPLE_POLICY_TEXT = {
  en: `Connecting Canadians Digital Access Strategy (2026–2029)

This federal initiative will modernize delivery of income support, employment insurance renewal, and pension applications by transitioning core services to a single online portal accessible through a GCKey account. Service Canada in-person offices will be consolidated from 317 to 180 locations over three years, with remaining call-centre capacity reduced by 25% to fund the new digital platform. The portal will be available in English and French, will meet WCAG 2.1 AA accessibility standards, and will include a chatbot for application support. Paper application channels will be phased out for new applicants starting in year two, with existing paper-based clients transitioned by year three. The Department projects $340 million in administrative savings over the planning period, primarily through reduced in-person and call-centre staffing.`,
  fr: `Stratégie d'accès numérique Relier les Canadiens (2026-2029)

Cette initiative fédérale modernisera la prestation du soutien au revenu, du renouvellement de l'assurance-emploi et des demandes de pension en transférant les services principaux vers un portail en ligne unique accessible par un compte CléGC. Les bureaux en personne de Service Canada seront regroupés, passant de 317 à 180 emplacements sur trois ans, et la capacité des centres d'appels sera réduite de 25 % pour financer la nouvelle plateforme numérique. Le portail sera offert en anglais et en français, respectera les normes d'accessibilité WCAG 2.1 AA et comprendra un agent conversationnel pour soutenir les demandes. Les voies de demande papier seront progressivement éliminées pour les nouveaux demandeurs à compter de la deuxième année, et les clients existants utilisant le papier seront transférés d'ici la troisième année. Le Ministère prévoit des économies administratives de 340 millions de dollars sur la période de planification, principalement grâce à la réduction du personnel en personne et des centres d'appels.`,
};
const SAMPLE_DS_FACTORS = ["indigenous", "disability", "age", "income", "geography", "language"];

const SAMPLE_TITLE = { en: "2026 Connecting Canadians Digital Access Survey", fr: "Sondage 2026 sur l'accès numérique Relier les Canadiens" };
const SAMPLE_SURVEY_TEXT = {
  en: `How satisfied are you with the new online portal for accessing government services?
Have you used the GCKey login system to access this service?
How often do you access government services using a mobile phone versus a computer?
Did you experience any difficulty completing your application online?
What is your age group?
What is your gender?
Do you identify as a person with a disability?
Do you identify as a First Nations, Métis, or Inuit person?
What is the main language spoken at home in your household?
Do you live in an urban, suburban, rural, or remote area?
What is your approximate annual household income?
Would you recommend this online service to others?`,
  fr: `Quel est votre niveau de satisfaction à l'égard du nouveau portail en ligne pour accéder aux services gouvernementaux?
Avez-vous utilisé le système de connexion CléGC pour accéder à ce service?
À quelle fréquence accédez-vous aux services gouvernementaux à partir d'un téléphone mobile plutôt que d'un ordinateur?
Avez-vous éprouvé des difficultés à remplir votre demande en ligne?
Quel est votre groupe d'âge?
Quel est votre genre?
Vous identifiez-vous comme une personne en situation de handicap?
Vous identifiez-vous comme une personne des Premières Nations, métisse ou inuite?
Quelle est la principale langue parlée à la maison dans votre foyer?
Habitez-vous en milieu urbain, suburbain, rural ou éloigné?
Quel est le revenu annuel approximatif de votre ménage?
Recommanderiez-vous ce service en ligne à d'autres personnes?`,
};
const SAMPLE_TWIN_FACTORS = ["indigenous", "disability", "age", "income", "geography"];
const SAMPLE_CHECKLIST_ADDRESSED = ["c3", "c11"];

/* ============================== PLAIN LANGUAGE HELPERS ============================== */
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  word = word.replace(/e$/, "");
  const m = word.match(/[aeiouy]+/g);
  return m ? Math.max(m.length, 1) : 1;
}
function textStats(text) {
  const sentences = (text.match(/[.!?]+/g) || []).length || 1;
  const words = text.trim().match(/\S+/g) || [];
  const wordCount = words.length || 0;
  const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
  return { sentences, wordCount, syllables };
}
function fleschKincaidGrade(text) {
  const { sentences, wordCount, syllables } = textStats(text);
  if (wordCount === 0) return { grade: 0, wordCount, sentences, syllables };
  const grade = 0.39 * (wordCount / sentences) + 11.8 * (syllables / wordCount) - 15.59;
  return { grade: Math.max(0, grade), wordCount, sentences, syllables };
}
function gradeBand(grade, lang) {
  if (grade <= 8) return { label: pick(UI.plainAccessible, lang), bg: T.greenBg, color: T.greenTxt };
  if (grade <= 12) return { label: pick(UI.plainModerate, lang), bg: T.amberBg, color: T.amberTxt };
  return { label: pick(UI.plainComplex, lang), bg: T.redBg, color: T.redTxt };
}

/* ============================== DOCUMENT SYNTHESIS TAB ============================== */
const DEPTH_INSTR = {
  summary: "Be concise — 2–3 findings and 1–2 recommendations per dimension.",
  detailed: "Be thorough — 3–5 findings per dimension with intersectional nuance.",
  expert: "Be comprehensive — 5+ findings, intersectionality, data gaps, systemic factors.",
};
function impactStyle(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high") || l.includes("significant") || l.includes("major") || l.includes("élevé")) return { bg: T.redBg, color: T.redTxt };
  if (l.includes("med") || l.includes("moderate") || l.includes("moy")) return { bg: T.amberBg, color: T.amberTxt };
  return { bg: T.greenBg, color: T.greenTxt };
}

function DocumentSynthesis({ lang }) {
  const t = useT(lang);
  const [dims, setDims] = useState(DIMS.map(d => ({ ...d })));
  const [docText, setDocText] = useState("");
  const [ctx, setCtx] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [outLang, setOutLang] = useState(lang);
  const [doctype, setDoctype] = useState("policy");
  const [tab, setTab] = useState("input");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => { setOutLang(lang); }, [lang]);

  const toggleDim = (i) => setDims(d => d.map((x, j) => j === i ? { ...x, on: !x.on } : x));
  const allDims = (v) => setDims(d => d.map(x => ({ ...x, on: v })));
  const activeDims = dims.filter(d => d.on);
  const wordCount = docText.trim() ? docText.trim().split(/\s+/).length : 0;

  const tabStyle = (tb) => ({ padding: "7px 18px", fontSize: 13, cursor: "pointer", border: "none", borderRight: `0.5px solid ${T.border}`, background: tab === tb ? T.surface : "transparent", color: tab === tb ? T.text : T.muted, fontWeight: tab === tb ? 500 : 400, fontFamily: "inherit" });

  async function run() {
    setError("");
    if (!docText.trim()) { setError(t("dsPasteFirst")); return; }
    if (docText.trim().length < 50) { setError(t("dsTooShort")); return; }
    if (!activeDims.length) { setError(t("dsPickDim")); return; }

    setLoading(true); setResult(null); setProgress(15);

    const dimList = activeDims.map(d => `- ${pick(d.label, "en")} (id: "${d.id}"): ${pick(d.desc, "en")}`).join("\n");
    const system = `You are an expert GBA+ (Gender-Based Analysis Plus) policy analyst used by the Government of Canada to assess how diverse groups experience policies differently.

${DEPTH_INSTR[depth]}
${outLang === "fr" ? "Respond entirely in French." : "Respond entirely in English."}
Document type: ${doctype}
${ctx ? "Additional context: " + ctx : ""}

Respond ONLY with a valid JSON object — no markdown fences, no extra text. Schema:
{
  "document_type": "string",
  "executive_summary": "2–4 sentence overall GBA+ assessment",
  "dimensions": [
    { "id": "must match a dimension id below", "label": "human-readable label", "impact_level": "High | Medium | Low | Not applicable", "findings": ["finding 1", "finding 2"], "recommendations": ["rec 1", "rec 2"] }
  ]
}

Only include dimensions relevant to the document. Dimensions to analyze:
${dimList}

Be critical and constructive. Identify gaps, blind spots, and differential impacts.`;

    try {
      setProgress(35);
      const resp = await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: [{ role: "user", content: "Analyze this document through the GBA+ lens:\n\n" + docText.slice(0, 8000) }] }),
      });
      setProgress(70);
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${resp.status}`); }
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      if (!raw) throw new Error("Empty response — please try again.");
      let clean = raw.replace(/```json|```/g, "").trim();
      const si = clean.indexOf("{"), ei = clean.lastIndexOf("}");
      if (si === -1 || ei === -1) throw new Error("Could not parse response JSON.");
      setProgress(100); setStatusMsg("");
      setResult(JSON.parse(clean.slice(si, ei + 1)));
    } catch (err) {
      setError(t("dsAnalysisFailed") + err.message);
    } finally {
      setLoading(false); setProgress(0); setStatusMsg("");
    }
  }

  function loadSample() {
    setDocText(pick(SAMPLE_POLICY_TEXT, lang));
    setDims(d => d.map(x => ({ ...x, on: SAMPLE_DS_FACTORS.includes(x.id) })));
    setTab("input");
  }

  function copyResult() {
    if (!result) return;
    const lines = ["GBA+ ANALYSIS", "", "Executive Synthesis:", result.executive_summary, ""];
    (result.dimensions || []).forEach(d => {
      lines.push(`## ${d.label} [${d.impact_level}]`);
      (d.findings || []).forEach(f => lines.push("→ " + f));
      if ((d.recommendations || []).length) { lines.push("Recommendations:"); d.recommendations.forEach(r => lines.push("✦ " + r)); }
      lines.push("");
    });
    navigator.clipboard.writeText(lines.join("\n"));
  }

  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: "1.25rem" }}>{t("dsDescription")}</p>

      <div style={{ display: "flex", border: `0.5px solid ${T.border}`, borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: "1.25rem" }}>
        {["input", "settings"].map(tb => (
          <button key={tb} style={tabStyle(tb)} onClick={() => setTab(tb)}>{tb === "input" ? t("dsTabInput") : t("dsTabSettings")}</button>
        ))}
      </div>

      {tab === "input" && (
        <div>
          <span style={sLabel}>{t("dsDocLabel")}</span>
          <textarea value={docText} onChange={e => setDocText(e.target.value)} placeholder={t("dsDocPlaceholder")} style={{ ...inputBase, width: "100%", minHeight: 200, resize: "vertical" }} />
          <p style={{ fontSize: 11, color: T.hint, textAlign: "right", marginTop: 4 }}>{wordCount.toLocaleString()} {wordCount !== 1 ? t("dsWordsSuffix") : t("dsWordSuffix")}</p>

          <div style={{ marginTop: "1.25rem" }}>
            <span style={sLabel}>{t("dsFactorsLabel")}</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 8, marginBottom: 10 }}>
              {dims.map((d, i) => (
                <div key={d.id} onClick={() => toggleDim(i)} style={{ border: d.on ? `1.5px solid ${T.green}` : `0.5px solid ${T.border}`, borderRadius: 8, padding: "9px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, background: d.on ? T.greenBg : T.surface }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: d.bg, color: d.txt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{d.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: d.on ? T.greenTxt : T.text }}>{pick(d.label, lang)}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{pick(d.desc, lang)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button style={btnSec} onClick={() => allDims(true)}>{t("dsSelectAll")}</button>
              <button style={btnSec} onClick={() => allDims(false)}>{t("dsClearAll")}</button>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 4 }}>{activeDims.length} {t("dsSelected")}</span>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div>
          <span style={sLabel}>{t("dsAnalysisConfig")}</span>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ ...sLabel, marginBottom: 5 }}>{t("dsDepth")}</p>
              <select value={depth} onChange={e => setDepth(e.target.value)} style={{ padding: "7px 10px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: T.surface, color: T.text, cursor: "pointer" }}>
                <option value="summary">{t("dsSummaryOpt")}</option>
                <option value="detailed">{t("dsDetailedOpt")}</option>
                <option value="expert">{t("dsExpertOpt")}</option>
              </select>
            </div>
            <div>
              <p style={{ ...sLabel, marginBottom: 5 }}>{t("dsOutputLanguage")}</p>
              <select value={outLang} onChange={e => setOutLang(e.target.value)} style={{ padding: "7px 10px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: T.surface, color: T.text, cursor: "pointer" }}>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <p style={{ ...sLabel, marginBottom: 5 }}>{t("dsDocType")}</p>
              <select value={doctype} onChange={e => setDoctype(e.target.value)} style={{ padding: "7px 10px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: T.surface, color: T.text, cursor: "pointer" }}>
                <option value="policy">{t("dsDocTypePolicy")}</option>
                <option value="program">{t("dsDocTypeProgram")}</option>
                <option value="report">{t("dsDocTypeReport")}</option>
                <option value="proposal">{t("dsDocTypeProposal")}</option>
                <option value="other">{t("dsDocTypeOther")}</option>
              </select>
            </div>
          </div>
          <span style={sLabel}>{t("dsContextLabel")}</span>
          <textarea value={ctx} onChange={e => setCtx(e.target.value)} placeholder={t("dsContextPlaceholder")} style={{ ...inputBase, width: "100%", minHeight: 80, resize: "vertical" }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: "1.25rem" }}>
        <button onClick={run} disabled={loading} style={btnPrimary(loading)}>
          {loading ? <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> : "◆"}
          {loading ? t("dsRunning") : t("dsRunBtn")}
        </button>
        <button style={btnSec} onClick={() => { setDocText(""); setResult(null); setError(""); }}>{t("dsClear")}</button>
        <button style={btnSec} onClick={loadSample}>◇ {t("dsLoadSample")}</button>
      </div>

      {loading && (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 2, background: T.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: T.green, borderRadius: 2, width: progress + "%", transition: "width 0.4s" }} />
          </div>
        </div>
      )}

      {error && <div style={{ background: T.redBg, border: `0.5px solid ${T.red}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.redTxt, marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: "1.5rem", borderTop: `0.5px solid ${T.border}`, paddingTop: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, color: T.text }}>{t("dsResultTitle")}</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {badge(T.greenPill, T.greenTxt, `${(result.dimensions || []).length} ${t("dsDimensionsWord")}`)}
              {badge(T.bluePill, T.blueTxt, result.document_type || doctype)}
              <button style={{ ...btnSec, fontSize: 12, padding: "5px 12px" }} onClick={copyResult}>{t("dsCopy")}</button>
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.25rem", borderLeft: `3px solid ${T.green}` }}>
            <p style={{ ...sLabel, marginBottom: 6 }}>{t("dsExecSummary")}</p>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: T.text }}>{result.executive_summary}</p>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {(result.dimensions || []).map(d => {
              const def = DIMS.find(x => x.id === d.id) || {};
              const imp = impactStyle(d.impact_level);
              return (
                <div key={d.id} style={card}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: def.bg || T.surface, color: def.txt || T.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{def.icon || "◆"}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{d.label || pick(def.label, lang) || d.id}</div>
                    {d.impact_level && <span style={{ marginLeft: "auto" }}>{badge(imp.bg, imp.color, d.impact_level)}</span>}
                  </div>
                  {(d.findings || []).map((f, i) => (
                    <div key={i} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 5, display: "flex", gap: 8 }}>
                      <span style={{ color: T.green, fontWeight: 600, flexShrink: 0 }}>→</span><span style={{ color: T.text }}>{f}</span>
                    </div>
                  ))}
                  {(d.recommendations || []).length > 0 && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${T.border}` }}>
                      <p style={{ ...sLabel, marginBottom: 6 }}>{t("dsRecActions")}</p>
                      {(d.recommendations || []).map((r, i) => (
                        <div key={i} style={{ fontSize: 12, lineHeight: 1.55, color: T.muted, marginBottom: 4, display: "flex", gap: 7 }}>
                          <span style={{ color: T.green, fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</span><span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== SURVEY TESTING TWIN ============================== */
function SurveyTwin({ lang }) {
  const t = useT(lang);
  const TWIN_NAV = [
    { id: "start", label: t("navStart") },
    { id: "input", label: t("navInput") },
    { id: "data", label: t("navData") },
    { id: "checklist", label: t("navChecklist") },
    { id: "simulate", label: t("navSimulate") },
    { id: "compliance", label: t("navCompliance") },
    { id: "missing", label: t("navMissing") },
    { id: "plain", label: t("navPlain") },
    { id: "brief", label: t("navBrief") },
  ];

  const [sub, setSub] = useState("start");
  const [meta, setMeta] = useState({ title: "", doctype: "policy" });
  const [factors, setFactors] = useState(DIMS.map(d => ({ ...d, on: ["disability", "indigenous", "age"].includes(d.id) })));
  const [surveyText, setSurveyText] = useState("");
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS.map(c => ({ ...c, addressed: false, severityOverride: null })));
  const [delivery, setDelivery] = useState({ onlineOnly: true, paper: false, phone: false, inPerson: false });
  const [langMode, setLangMode] = useState("en_fr");
  const [accessibleFormat, setAccessibleFormat] = useState(false);
  const [plainTextEn, setPlainTextEn] = useState("");
  const [rewriteSuggestion, setRewriteSuggestion] = useState(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [frameworkApplicable, setFrameworkApplicable] = useState(() => Object.fromEntries(FRAMEWORKS.map(f => [f.id, true])));
  const [gapResolved, setGapResolved] = useState({});
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const activeFactors = factors.filter(f => f.on);
  const toggleFactor = (i) => setFactors(fs => fs.map((f, j) => j === i ? { ...f, on: !f.on } : f));

  function goTo(tile) { setSub(tile.goTo); }

  function loadSample() {
    setMeta({ title: pick(SAMPLE_TITLE, lang), doctype: "program" });
    setFactors(fs => fs.map(f => ({ ...f, on: SAMPLE_TWIN_FACTORS.includes(f.id) })));
    setSurveyText(pick(SAMPLE_SURVEY_TEXT, lang));
    setChecklist(CHECKLIST_ITEMS.map(c => ({ ...c, addressed: SAMPLE_CHECKLIST_ADDRESSED.includes(c.id), severityOverride: null })));
    setDelivery({ onlineOnly: true, paper: false, phone: false, inPerson: false });
    setLangMode("en_only");
    setAccessibleFormat(false);
    setPlainTextEn(""); setRewriteSuggestion(null); setSimResult(null);
    setSub("input");
  }

  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: "1.25rem" }}>{t("twinDescription")}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.25rem" }}>
        {TWIN_NAV.map(n => <button key={n.id} style={pillTab(sub === n.id)} onClick={() => setSub(n.id)}>{n.label}</button>)}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder={t("twinTitleInput")} style={{ ...inputBase, width: 260 }} />
        <select value={meta.doctype} onChange={e => setMeta(m => ({ ...m, doctype: e.target.value }))} style={{ padding: "9px 10px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: T.surface, color: T.text, cursor: "pointer" }}>
          <option value="policy">{t("twinDocTypePolicy")}</option>
          <option value="program">{t("twinDocTypeProgram")}</option>
          <option value="hr">{t("twinDocTypeHr")}</option>
          <option value="research">{t("twinDocTypeResearch")}</option>
        </select>
        <button style={btnSec} onClick={loadSample}>◇ {t("twinLoadSample")}</button>
        <a href="https://lequanne.github.io/GBAplus-tool/" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blueTxt, marginLeft: "auto" }}>{t("twinOriginalLink")}</a>
      </div>

      {sub === "start" && <Sec_Start onTile={goTo} lang={lang} t={t} />}
      {sub === "input" && <Sec_Input surveyText={surveyText} setSurveyText={setSurveyText} factors={factors} toggleFactor={toggleFactor} lang={lang} t={t} />}
      {sub === "data" && <Sec_PopData factors={factors} toggleFactor={toggleFactor} lang={lang} t={t} />}
      {sub === "checklist" && <Sec_Checklist checklist={checklist} setChecklist={setChecklist} activeFactors={activeFactors} lang={lang} t={t} />}
      {sub === "simulate" && <Sec_Simulate activeFactors={activeFactors} checklist={checklist} delivery={delivery} plainGrade={fleschKincaidGrade(plainTextEn || surveyText).grade} simResult={simResult} setSimResult={setSimResult} simLoading={simLoading} setSimLoading={setSimLoading} lang={lang} t={t} />}
      {sub === "compliance" && <Sec_Compliance frameworkApplicable={frameworkApplicable} setFrameworkApplicable={setFrameworkApplicable} gapResolved={gapResolved} setGapResolved={setGapResolved} lang={lang} t={t} />}
      {sub === "missing" && <Sec_Missing delivery={delivery} setDelivery={setDelivery} langMode={langMode} setLangMode={setLangMode} accessibleFormat={accessibleFormat} setAccessibleFormat={setAccessibleFormat} lang={lang} t={t} />}
      {sub === "plain" && <Sec_PlainLanguage text={plainTextEn || surveyText} setText={setPlainTextEn} rewriteSuggestion={rewriteSuggestion} setRewriteSuggestion={setRewriteSuggestion} rewriteLoading={rewriteLoading} setRewriteLoading={setRewriteLoading} lang={lang} t={t} />}
      {sub === "brief" && <Sec_Brief meta={meta} activeFactors={activeFactors} checklist={checklist} delivery={delivery} langMode={langMode} accessibleFormat={accessibleFormat} frameworkApplicable={frameworkApplicable} gapResolved={gapResolved} plainGrade={fleschKincaidGrade(plainTextEn || surveyText).grade} simResult={simResult} lang={lang} t={t} />}
    </div>
  );
}

/* ---------- Start: task-based entry tiles ---------- */
function Sec_Start({ onTile, lang, t }) {
  return (
    <div>
      <span style={sLabel}>{t("startPrompt")}</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {TASK_TILES.map(tile => (
          <div key={tile.id} onClick={() => onTile(tile)} style={{ ...card, marginBottom: 0, cursor: "pointer", borderColor: T.border }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 6 }}>{pick(tile.title, lang)}</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{pick(tile.desc, lang)}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, borderLeft: `3px solid ${T.green}` }}>
        <p style={{ ...sLabel, marginBottom: 6 }}>{t("startPrincipleTitle")}</p>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: T.muted }}>{pick(UI.startPrinciple, lang)}</p>
        <p style={{ fontSize: 12, color: T.hint, marginTop: 8 }}>
          <b style={{ color: T.text, fontWeight: 500 }}>{t("startTipLead")}</b> {pick(UI.startTip, lang)}
        </p>
      </div>
    </div>
  );
}

/* ---------- Survey input ---------- */
function Sec_Input({ surveyText, setSurveyText, factors, toggleFactor, lang, t }) {
  const wc = surveyText.trim() ? surveyText.trim().split(/\s+/).length : 0;
  return (
    <div>
      <span style={sLabel}>{t("inputSurveyLabel")}</span>
      <textarea value={surveyText} onChange={e => setSurveyText(e.target.value)} placeholder={t("inputSurveyPlaceholder")} style={{ ...inputBase, width: "100%", minHeight: 220, resize: "vertical" }} />
      <p style={{ fontSize: 11, color: T.hint, textAlign: "right", marginTop: 4 }}>{wc.toLocaleString()} {wc !== 1 ? t("dsWordsSuffix") : t("dsWordSuffix")}</p>

      <div style={{ marginTop: "1.25rem" }}>
        <span style={sLabel}>{t("inputTargetFactors")}</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 8 }}>
          {factors.map((d, i) => (
            <div key={d.id} onClick={() => toggleFactor(i)} style={{ border: d.on ? `1.5px solid ${T.green}` : `0.5px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: d.on ? T.greenBg : T.surface }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: d.bg, color: d.txt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{d.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: d.on ? T.greenTxt : T.text }}>{pick(d.label, lang)}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: T.hint, marginTop: 8 }}>{t("inputDrivesNote")}</p>
      </div>
    </div>
  );
}

/* ---------- Population data: "what the data already shows" ---------- */
function Sec_PopData({ factors, toggleFactor, lang, t }) {
  const active = factors.filter(f => f.on);
  return (
    <div>
      <span style={sLabel}>{t("dataSelectPrompt")}</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 8, marginBottom: "1.25rem" }}>
        {factors.map((d, i) => (
          <div key={d.id} onClick={() => toggleFactor(i)} style={{ border: d.on ? `1.5px solid ${T.green}` : `0.5px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: d.on ? T.greenBg : T.surface }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: d.bg, color: d.txt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{d.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: d.on ? T.greenTxt : T.text }}>{pick(d.label, lang)}</div>
          </div>
        ))}
      </div>

      {active.length === 0 && <p style={{ fontSize: 13, color: T.muted }}>{t("dataNoneSelected")}</p>}

      <div style={{ display: "grid", gap: 10 }}>
        {active.map(f => {
          const ref = REFERENCE_DATA[f.id];
          if (!ref) return null;
          return (
            <div key={f.id} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: f.bg, color: f.txt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{pick(f.label, lang)}</div>
              </div>
              {ref.stats.length === 0 ? (
                <div style={{ background: T.amberBg, border: `0.5px solid ${T.amber}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: T.amberTxt, marginBottom: 8 }}>
                  {t("dataOpenGap")}{pick(ref.note, lang)}
                </div>
              ) : (
                <>
                  <table style={{ width: "100%", fontSize: 12, marginBottom: 8 }}>
                    <tbody>
                      {ref.stats.map((s, i) => (
                        <tr key={i} style={{ borderBottom: i < ref.stats.length - 1 ? `0.5px solid ${T.border}` : "none" }}>
                          <td style={{ padding: "5px 0", color: T.muted }}>{pick(s.metric, lang)}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontWeight: 500, color: T.text }}>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize: 12, lineHeight: 1.55, color: T.muted, marginBottom: 6 }}>{pick(ref.note, lang)}</p>
                  <p style={{ fontSize: 10, color: T.hint, marginBottom: ref.frameworks ? 6 : 0 }}>{t("dataSources")}{[...new Set(ref.stats.map(s => pick(s.source, lang)))].join(" · ")}</p>
                </>
              )}
              {ref.frameworks && ref.frameworks.length > 0 && (
                <p style={{ fontSize: 10, color: T.hint }}>
                  {t("dataFrameworks")}
                  {ref.frameworks.map((r, i) => (
                    <span key={i}><a href={r.url} target="_blank" rel="noreferrer" style={{ color: T.blueTxt }}>{pick(r.label, lang)}</a>{i < ref.frameworks.length - 1 ? " · " : ""}</span>
                  ))}
                </p>
              )}
              {(() => {
                const clustered = CHECKLIST_ITEMS.filter(c => c.clusters.includes(f.id));
                return clustered.length > 0 ? (
                  <p style={{ fontSize: 11, color: T.hint, marginTop: 6 }}>{t("dataIntersects")} {clustered.length} {t("dataChecklistItems")}</p>
                ) : null;
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- GBA+ checklist: severity + clustering ---------- */
function severityFor(item, activeFactors) {
  const activeIds = activeFactors.map(f => f.id);
  const intersectsTarget = item.clusters.some(c => activeIds.includes(c));
  const isStructural = item.clusters.some(c => Object.keys(STRUCTURAL_TAGS).includes(c));
  if (intersectsTarget) return "high";
  if (isStructural) return "medium";
  return "low";
}
const SEV_KEY = { high: "checklistHigh", medium: "checklistMedium", low: "checklistLow" };
const SEV_COLOR = { high: { bg: T.redBg, color: T.redTxt }, medium: { bg: T.amberBg, color: T.amberTxt }, low: { bg: T.greenBg, color: T.greenTxt } };

function clusterLabel(tag, lang) {
  if (STRUCTURAL_TAGS[tag]) return pick(STRUCTURAL_TAGS[tag], lang);
  const d = DIMS.find(x => x.id === tag);
  return d ? pick(d.label, lang) : tag;
}

function Sec_Checklist({ checklist, setChecklist, activeFactors, lang, t }) {
  const toggle = (id) => setChecklist(cs => cs.map(c => c.id === id ? { ...c, addressed: !c.addressed } : c));
  const setSeverity = (id, sev) => setChecklist(cs => cs.map(c => c.id === id ? { ...c, severityOverride: sev } : c));
  const [openEvidence, setOpenEvidence] = useState({});
  const toggleEvidence = (id) => setOpenEvidence(o => ({ ...o, [id]: !o[id] }));

  const unaddressed = checklist.filter(c => !c.addressed);
  const clusterTally = {};
  unaddressed.forEach(c => c.clusters.forEach(tag => { clusterTally[tag] = (clusterTally[tag] || 0) + 1; }));
  const compoundClusters = Object.entries(clusterTally).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);

  const addressedCount = checklist.length - unaddressed.length;

  return (
    <div>
      <div style={{ ...card, borderLeft: `3px solid ${T.green}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: T.muted }}>{t("checklistAlignedTo")}</span>
        <a href={SRC.wageGuide.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blueTxt }}>{pick(SRC.wageGuide.label, lang)} ↗</a>
        <span style={{ color: T.hint }}>·</span>
        <a href={SRC.csps.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blueTxt }}>{pick(SRC.csps.label, lang)} ↗</a>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", marginTop: 10, flexWrap: "wrap" }}>
        {badge(T.greenPill, T.greenTxt, `${addressedCount}/${checklist.length} ${t("checklistAddressed")}`)}
        {badge(T.redBg, T.redTxt, `${unaddressed.filter(c => severityFor(c, activeFactors) === "high").length} ${t("checklistHighGaps")}`)}
      </div>

      {compoundClusters.length > 0 && (
        <div style={{ ...card, borderLeft: `3px solid ${T.amber}`, marginBottom: "1.25rem" }}>
          <p style={{ ...sLabel, marginBottom: 6 }}>{t("checklistCompoundTitle")}</p>
          {compoundClusters.map(([tag, n]) => (
            <p key={tag} style={{ fontSize: 12, lineHeight: 1.6, color: T.muted, marginBottom: 4 }}>→ <b style={{ color: T.text, fontWeight: 500 }}>{clusterLabel(tag, lang)}</b> {t("checklistCompoundLine1")} {n} {t("checklistCompoundLine2")}</p>
          ))}
        </div>
      )}

      {GBA_STEPS.map((stepLabel, stepIdx) => {
        const items = checklist.filter(c => c.step === stepIdx + 1);
        return (
          <div key={stepIdx} style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: T.blueTxt, marginBottom: 8 }}>{t("checklistStep")} {stepIdx + 1} — {pick(stepLabel, lang)}</p>
            <div style={{ display: "grid", gap: 8 }}>
              {items.map(item => {
                const sev = item.severityOverride || severityFor(item, activeFactors);
                const sevC = SEV_COLOR[sev];
                const ev = CHECKLIST_RESOURCES[item.id];
                const isOpen = !!openEvidence[item.id];
                return (
                  <div key={item.id} style={{ ...card, marginBottom: 0, opacity: item.addressed ? 0.55 : 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <input type="checkbox" checked={item.addressed} onChange={() => toggle(item.id)} style={{ marginTop: 3, flexShrink: 0, accentColor: T.green }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <p style={{ fontSize: 13, color: T.text, lineHeight: 1.55, marginBottom: 6, textDecoration: item.addressed ? "line-through" : "none", flex: 1 }}>{pick(item.text, lang)}</p>
                          {ev && (
                            <button onClick={() => toggleEvidence(item.id)} title={t("checklistEvidenceTitle")} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", border: `0.5px solid ${isOpen ? T.blueTxt : T.border}`, background: isOpen ? T.bluePill : "transparent", color: isOpen ? T.blueTxt : T.hint, fontSize: 11, cursor: "pointer", fontFamily: "inherit", lineHeight: 1 }}>ⓘ</button>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          {item.clusters.map(c => <span key={c} style={{ fontSize: 10, color: T.hint, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: "1px 8px" }}>{clusterLabel(c, lang)}</span>)}
                          {!item.addressed && (
                            <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                              {["low", "medium", "high"].map(s => (
                                <button key={s} onClick={() => setSeverity(item.id, s)} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, border: `0.5px solid ${sev === s ? sevC.color : T.border}`, background: sev === s ? sevC.bg : "transparent", color: sev === s ? sevC.color : T.hint, cursor: "pointer" }}>{t(SEV_KEY[s])}</button>
                              ))}
                            </span>
                          )}
                        </div>

                        {isOpen && ev && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${T.border}`, display: "grid", gap: 8 }}>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 500, color: T.hint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{t("checklistRefStandards")}</p>
                              {ev.references.map((r, i) => <div key={i}><a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blueTxt }}>{pick(r.label, lang)} ↗</a></div>)}
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 500, color: T.hint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{t("checklistAlternative")}</p>
                              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55 }}>{pick(ev.alternative, lang)}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 500, color: T.greenTxt, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{t("checklistQuickAction")}</p>
                              <p style={{ fontSize: 12, color: T.text, lineHeight: 1.55 }}>{pick(ev.quickAction, lang)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Simulation: grounded in cited population rates ---------- */
const REACH_RATES = {
  age: { rate: 0.826, source: { en: "82.6% of Canadians 65+ used the internet — StatCan CIUS, 2022", fr: "82,6 % des Canadiens de 65 ans et plus utilisaient Internet — StatCan, EUTIC, 2022" } },
  indigenous: { rate: 0.43, source: { en: "≈43% of First Nations reserve households have 50/10 Mbps access — CRTC, Mar. 2023", fr: "≈43 % des ménages des réserves des Premières Nations ont un accès 50/10 Mbps — CRTC, mars 2023" } },
  geography: { rate: 0.62, source: { en: "≈62% of rural households have 50/10 Mbps access — CRTC, Mar. 2023", fr: "≈62 % des ménages ruraux ont un accès 50/10 Mbps — CRTC, mars 2023" } },
  income: { rate: 0.54, source: { en: "54% of lower-income (<$20k) seniors are internet users — StatCan GSS, 2016", fr: "54 % des aînés à faible revenu (<20 000 $) utilisent Internet — StatCan, ESG, 2016" } },
};
function runSimulation(activeFactors, checklist, delivery, plainGrade) {
  const ids = activeFactors.map(f => f.id);
  const onlineOnly = delivery.onlineOnly && !delivery.paper && !delivery.phone && !delivery.inPerson;
  const reachComponents = onlineOnly ? ids.filter(id => REACH_RATES[id]).map(id => ({ id, ...REACH_RATES[id] })) : [];
  const reachRate = reachComponents.length ? reachComponents.reduce((s, r) => s + r.rate, 0) / reachComponents.length : 0.97;

  const unaddressed = checklist.filter(c => !c.addressed);
  const highSev = unaddressed.filter(c => (c.severityOverride || severityFor(c, activeFactors)) === "high").length;
  const medSev = unaddressed.filter(c => (c.severityOverride || severityFor(c, activeFactors)) === "medium").length;

  let completion = 90 - highSev * 4 - medSev * 2;
  if (plainGrade > 8) completion -= (plainGrade - 8) * 3;
  completion = Math.max(15, Math.min(98, completion));

  const effective = round(reachRate * (completion / 100) * 100, 1);

  const n = 500;
  let completedCount = 0;
  const times = [];
  for (let i = 0; i < n; i++) {
    const ok = Math.random() * 100 < effective;
    if (ok) completedCount++;
    const baseTime = 6 + plainGrade * 0.4 + highSev * 0.6;
    times.push(Math.max(2, baseTime + (Math.random() - 0.5) * 3));
  }
  const avgTime = round(times.reduce((s, t2) => s + t2, 0) / n, 1);
  const dataQuality = round(Math.max(40, 95 - highSev * 5 - medSev * 2 - Math.max(0, plainGrade - 8) * 2), 1);

  return { reachRate: round(reachRate * 100, 1), completionRate: round(completion, 1), effective, observed: round((completedCount / n) * 100, 1), avgTime, dataQuality, reachComponents, highSev, medSev, n };
}

function Sec_Simulate({ activeFactors, checklist, delivery, plainGrade, simResult, setSimResult, simLoading, setSimLoading, lang, t }) {
  function run() {
    setSimLoading(true);
    setTimeout(() => {
      setSimResult(runSimulation(activeFactors, checklist, delivery, plainGrade || 8));
      setSimLoading(false);
    }, 500);
  }

  return (
    <div>
      <div style={{ ...card, borderLeft: `3px solid ${T.blueTxt}` }}>
        <p style={{ ...sLabel, marginBottom: 6 }}>{t("simGroundedTitle")}</p>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: T.muted }}>{t("simGroundedText")}</p>
      </div>

      <button onClick={run} disabled={simLoading} style={{ ...btnPrimary(simLoading), marginBottom: "1.25rem" }}>
        {simLoading ? t("simRunning") : "◆ " + t("simRunBtn")}
      </button>

      {simResult && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: "1.25rem" }}>
            {[
              { label: t("simReach"), val: `${simResult.reachRate}%` },
              { label: t("simCompletion"), val: `${simResult.completionRate}%` },
              { label: t("simEffective"), val: `${simResult.effective}%` },
              { label: t("simObserved"), val: `${simResult.observed}%` },
              { label: t("simAvgTime"), val: `${simResult.avgTime} ${t("minUnit")}` },
              { label: t("simAvgQuality"), val: `${simResult.dataQuality}/100` },
            ].map(s => (
              <div key={s.label} style={{ background: T.surface, borderRadius: 10, padding: "0.9rem 1rem" }}>
                <p style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 500, color: T.text }}>{s.val}</p>
              </div>
            ))}
          </div>

          <div style={{ ...card }}>
            <p style={{ ...sLabel, marginBottom: 8 }}>{t("simFunnelTitle")}</p>
            {[
              { label: t("simStarted"), pct: 100 },
              { label: t("simReached"), pct: simResult.reachRate },
              { label: t("simCompleted"), pct: simResult.effective },
            ].map(b => (
              <div key={b.label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 3 }}><span>{b.label}</span><span>{b.pct}%</span></div>
                <div style={{ height: 8, background: T.border, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${b.pct}%`, background: T.green, borderRadius: 4 }} /></div>
              </div>
            ))}
          </div>

          {simResult.reachComponents.length > 0 && (
            <div style={card}>
              <p style={{ ...sLabel, marginBottom: 8 }}>{t("simParamsUsed")}</p>
              {simResult.reachComponents.map(r => (
                <p key={r.id} style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>→ {pick(DIMS.find(d => d.id === r.id)?.label, lang)}: <span style={{ color: T.text }}>{pick(r.source, lang)}</span></p>
              ))}
            </div>
          )}

          <p style={{ fontSize: 11, color: T.hint }}>{simResult.highSev} {t("simGapsNote")} {simResult.medSev} {t("simGapsNote2")}</p>
        </>
      )}
    </div>
  );
}

/* ---------- Compliance: legal hook map + currency tracker ---------- */
function Sec_Compliance({ frameworkApplicable, setFrameworkApplicable, gapResolved, setGapResolved, lang, t }) {
  const toggleGap = (key) => setGapResolved(g => ({ ...g, [key]: !g[key] }));
  const applicableFrameworks = FRAMEWORKS.filter(f => frameworkApplicable[f.id]);
  const totalGaps = applicableFrameworks.reduce((s, f) => s + f.gaps.length, 0);
  const resolvedGaps = applicableFrameworks.reduce((s, f) => s + f.gaps.filter((g, i) => gapResolved[f.id + i]).length, 0);
  const flaggedCount = applicableFrameworks.filter(f => f.flagged).length;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {badge(T.greenPill, T.greenTxt, `${resolvedGaps}/${totalGaps} ${t("compResolved")}`)}
        {flaggedCount > 0 && badge(T.amberBg, T.amberTxt, `${flaggedCount} ${t("compFlaggedFrameworks")}`)}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {FRAMEWORKS.map(f => (
          <div key={f.id} style={{ ...card, opacity: frameworkApplicable[f.id] ? 1 : 0.45 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <input type="checkbox" checked={!!frameworkApplicable[f.id]} onChange={() => setFrameworkApplicable(s => ({ ...s, [f.id]: !s[f.id] }))} style={{ marginTop: 3, accentColor: T.green }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{pick(f.name, lang)}</span>
                  {f.flagged && badge(T.amberBg, T.amberTxt, "⚠ " + t("compVerifyCurrency"))}
                </div>
                <p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{pick(f.regulator, lang)} · {t("compLastVerified")} {pick(f.lastVerified, lang)}</p>
              </div>
            </div>

            {f.flagged && (
              <div style={{ background: T.amberBg, border: `0.5px solid ${T.amber}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: T.amberTxt, marginBottom: 10 }}>{pick(f.flagText, lang)}</div>
            )}

            {frameworkApplicable[f.id] && (
              <div style={{ display: "grid", gap: 8 }}>
                {f.gaps.map((g, i) => {
                  const key = f.id + i;
                  const resolved = !!gapResolved[key];
                  return (
                    <div key={key} style={{ background: T.surface, borderRadius: 8, padding: "0.7rem 0.9rem", opacity: resolved ? 0.55 : 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <input type="checkbox" checked={resolved} onChange={() => toggleGap(key)} style={{ marginTop: 3, flexShrink: 0, accentColor: T.green }} />
                        <div>
                          <p style={{ fontSize: 12, color: T.text, marginBottom: 4, textDecoration: resolved ? "line-through" : "none" }}><b style={{ fontWeight: 500 }}>{t("compGapLabel")}</b> {pick(g.gap, lang)}</p>
                          <p style={{ fontSize: 11, color: T.blueTxt, marginBottom: 4 }}><b style={{ fontWeight: 500 }}>{t("compClauseLabel")}</b> {pick(g.clause, lang)}</p>
                          <p style={{ fontSize: 11, color: T.muted }}><b style={{ fontWeight: 500, color: T.greenTxt }}>{t("compFixLabel")}</b> {pick(g.fix, lang)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Who's missing: structural exclusion estimator ---------- */
const ADULT_POP = 31000000;

function Sec_Missing({ delivery, setDelivery, langMode, setLangMode, accessibleFormat, setAccessibleFormat, lang, t }) {
  const onlineOnly = delivery.onlineOnly && !delivery.paper && !delivery.phone && !delivery.inPerson;
  const langOnly = langMode === "en_only" || langMode === "fr_only";

  return (
    <div>
      <span style={sLabel}>{t("missingDeliverySettings")}</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, marginBottom: "1.25rem" }}>
        {[
          { key: "onlineOnly", label: t("missingOnline") },
          { key: "paper", label: t("missingPaper") },
          { key: "phone", label: t("missingPhone") },
          { key: "inPerson", label: t("missingInPerson") },
        ].map(o => (
          <label key={o.key} style={{ ...card, marginBottom: 0, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={delivery[o.key]} onChange={() => setDelivery(d => ({ ...d, [o.key]: !d[o.key] }))} style={{ accentColor: T.green }} />
            <span style={{ fontSize: 12, color: T.text }}>{o.label}</span>
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div>
          <p style={{ ...sLabel, marginBottom: 5 }}>{t("missingLangMode")}</p>
          <select value={langMode} onChange={e => setLangMode(e.target.value)} style={{ padding: "7px 10px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, background: T.surface, color: T.text }}>
            <option value="en_fr">{t("missingLangEnFr")}</option>
            <option value="en_only">{t("missingLangEnOnly")}</option>
            <option value="fr_only">{t("missingLangFrOnly")}</option>
            <option value="multilingual">{t("missingLangMulti")}</option>
          </select>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 18 }}>
          <input type="checkbox" checked={accessibleFormat} onChange={() => setAccessibleFormat(v => !v)} style={{ accentColor: T.green }} />
          <span style={{ fontSize: 12, color: T.text }}>{t("missingAccessible")}</span>
        </label>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {onlineOnly && (
          <div style={{ ...card, borderLeft: `3px solid ${T.red}` }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.redTxt, marginBottom: 6 }}>{t("missingOnlineFlagTitle")}</p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 4 }}>{t("missingOnlineFlag1")} <b style={{ color: T.text }}>{Math.round(ADULT_POP * 0.05).toLocaleString()}</b> {t("missingOnlineFlag1b")} <span style={{ color: T.hint }}>{t("missingOnlineSrc1")}</span></p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 4 }}>{t("missingOnlineFlag2")} <span style={{ color: T.hint }}>{t("missingOnlineSrc2")}</span></p>
          </div>
        )}
        {langOnly && (
          <div style={{ ...card, borderLeft: `3px solid ${T.amber}` }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.amberTxt, marginBottom: 6 }}>{t("missingLangFlagTitle")}</p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 4 }}>{t("missingLangFlag1")} <b style={{ color: T.text }}>{Math.round(ADULT_POP * 0.214).toLocaleString()}</b> {t("missingLangFlag1b")} <span style={{ color: T.hint }}>{t("missingLangSrc1")}</span></p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{t("missingLangFlag2")}</p>
          </div>
        )}
        {!accessibleFormat && (
          <div style={{ ...card, borderLeft: `3px solid ${T.amber}` }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.amberTxt, marginBottom: 6 }}>{t("missingAccFlagTitle")}</p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 4 }}>{t("missingAccFlag")} <span style={{ color: T.hint }}>{t("missingAccFlagSrc")}</span></p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{t("missingAccFlag2")}</p>
          </div>
        )}
        <div style={{ ...card, borderLeft: `3px solid ${T.blueTxt}` }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: T.blueTxt, marginBottom: 6 }}>{t("missingStructuralTitle")}</p>
          <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{t("missingStructuralText")}</p>
        </div>
        {!onlineOnly && !langOnly && accessibleFormat && (
          <p style={{ fontSize: 12, color: T.muted }}>{t("missingNoFlags")}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Plain language score + AI rewrite ---------- */
function Sec_PlainLanguage({ text, setText, rewriteSuggestion, setRewriteSuggestion, rewriteLoading, setRewriteLoading, lang, t }) {
  const stats = fleschKincaidGrade(text);
  const band = gradeBand(stats.grade, lang);
  const target = 8;

  async function suggestRewrite() {
    if (!text.trim()) return;
    setRewriteLoading(true); setRewriteSuggestion(null);
    try {
      const resp = await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You rewrite Canadian government survey questions into plain language at roughly a Grade 8 reading level, per Statistics Canada / Canada.ca plain-language guidance, while preserving the exact meaning and response options. ${lang === "fr" ? "Respond entirely in French." : "Respond entirely in English."} Respond ONLY with the rewritten text, one question per line, no preamble, no markdown.`,
          messages: [{ role: "user", content: "Rewrite this survey text in plain language:\n\n" + text.slice(0, 6000) }],
        }),
      });
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${resp.status}`); }
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      setRewriteSuggestion(raw || "No suggestion returned — try again.");
    } catch (e) {
      setRewriteSuggestion("Error: " + e.message);
    } finally {
      setRewriteLoading(false);
    }
  }

  return (
    <div>
      <span style={sLabel}>{t("plainTextLabel")}</span>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t("plainTextPlaceholder")} style={{ ...inputBase, width: "100%", minHeight: 160, resize: "vertical", marginBottom: 12 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: "1.25rem" }}>
        <div style={{ background: T.surface, borderRadius: 10, padding: "0.9rem 1rem" }}>
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{t("plainGradeLabel")}</p>
          <p style={{ fontSize: 22, fontWeight: 500, color: T.text }}>{round(stats.grade, 1)}</p>
        </div>
        <div style={{ background: T.surface, borderRadius: 10, padding: "0.9rem 1rem" }}>
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{t("plainTargetLabel")}</p>
          <p style={{ fontSize: 22, fontWeight: 500, color: T.text }}>{t("plainGradeWord")} {target}</p>
        </div>
        <div style={{ background: T.surface, borderRadius: 10, padding: "0.9rem 1rem" }}>
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{t("plainWordsSentences")}</p>
          <p style={{ fontSize: 22, fontWeight: 500, color: T.text }}>{stats.wordCount} / {stats.sentences}</p>
        </div>
      </div>
      <div style={{ marginBottom: "1.25rem" }}>{badge(band.bg, band.color, band.label)}</div>

      <button onClick={suggestRewrite} disabled={rewriteLoading || !text.trim()} style={btnPrimary(rewriteLoading)}>
        {rewriteLoading ? t("plainRewriting") : "◆ " + t("plainSuggestBtn")}
      </button>

      {rewriteSuggestion && (
        <div style={{ ...card, marginTop: "1.25rem" }}>
          <p style={{ ...sLabel, marginBottom: 8 }}>{t("plainSuggestedTitle")}</p>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: T.text, lineHeight: 1.6, margin: 0 }}>{rewriteSuggestion}</pre>
        </div>
      )}

      <p style={{ fontSize: 11, color: T.hint, marginTop: 10 }}>{t("plainHeuristicNote")}</p>
    </div>
  );
}

/* ---------- Briefing note generator ---------- */
function buildBriefingText({ meta, activeFactors, checklist, delivery, langMode, accessibleFormat, frameworkApplicable, gapResolved, plainGrade, simResult, lang }) {
  const fr = lang === "fr";
  const unaddressed = checklist.filter(c => !c.addressed);
  const highItems = unaddressed.filter(c => (c.severityOverride || severityFor(c, activeFactors)) === "high");
  const clusterTally = {};
  unaddressed.forEach(c => c.clusters.forEach(tg => { clusterTally[tg] = (clusterTally[tg] || 0) + 1; }));
  const topClusters = Object.entries(clusterTally).filter(([, n]) => n >= 2).map(([tg]) => clusterLabel(tg, lang));

  const applicable = FRAMEWORKS.filter(f => frameworkApplicable[f.id]);
  const openGaps = [];
  applicable.forEach(f => f.gaps.forEach((g, i) => { if (!gapResolved[f.id + i]) openGaps.push({ framework: pick(f.name, lang), ...g }); }));
  const flaggedFrameworks = applicable.filter(f => f.flagged);

  const factorNames = activeFactors.map(f => pick(f.label, lang)).join(", ") || (fr ? "aucun facteur sélectionné" : "no factors selected");
  const title = meta.title || (fr ? "Sondage sans titre" : "Untitled survey");

  let p1, p2, p3, p4, recommend;

  if (fr) {
    p1 = `Cet instrument de sondage (« ${title} ») a été examiné à l'aide du jumeau de test de sondages selon ${activeFactors.length} facteur(s) identitaire(s) intersectionnel(s) : ${factorNames}. ${checklist.length - unaddressed.length} des ${checklist.length} éléments de la liste de vérification de l'ACS+ sont actuellement traités.`;
    if (highItems.length) p1 += ` ${highItems.length} lacune(s) de gravité élevée subsistent, notamment : ${highItems.slice(0, 2).map(i => `« ${pick(i.text, lang)} »`).join("; ")}.`;
    if (topClusters.length) p1 += ` Ces lacunes se regroupent autour de ${topClusters.join(" et ")}, qui ont tendance à se cumuler pour les mêmes répondants plutôt que d'agir indépendamment.`;

    p2 = `L'examen de conformité portant sur ${applicable.length} cadre(s) a relevé ${openGaps.length} lacune(s) non résolue(s).`;
    if (openGaps.length) p2 += ` La plus importante : ${pick(openGaps[0].gap, lang)} (${pick(openGaps[0].clause, lang)}).`;
    if (flaggedFrameworks.length) p2 += ` Remarque : les orientations relatives à ${flaggedFrameworks.map(f => pick(f.name, lang)).join(", ")} devraient être revérifiées avant la présentation — ${pick(flaggedFrameworks[0].flagText, lang)}`;

    const onlineOnly = delivery.onlineOnly && !delivery.paper && !delivery.phone && !delivery.inPerson;
    const langOnly = langMode === "en_only" || langMode === "fr_only";
    p3 = "Selon les paramètres actuels de diffusion et de langue, ";
    const notes = [];
    if (onlineOnly) notes.push(`environ ${Math.round(ADULT_POP * 0.05).toLocaleString()} Canadiens (non-utilisateurs d'Internet, StatCan EUTIC 2022) pourraient être structurellement incapables d'accéder à cet instrument`);
    if (langOnly) notes.push(`environ ${Math.round(ADULT_POP * 0.214).toLocaleString()} Canadiens dont la langue maternelle n'est pas une langue officielle (recensement de 2021) pourraient faire face à des obstacles additionnels`);
    if (!accessibleFormat) notes.push(`les 27 % de Canadiens de 15 ans et plus ayant une incapacité (ECI 2022) ne disposent pas d'un format accessible confirmé`);
    p3 += notes.length ? notes.join("; ") + "." : "aucun risque majeur d'exclusion lié à la conception n'a été signalé.";

    p4 = `L'analyse du langage clair estime un niveau de lecture de ${round(plainGrade, 1)}e année par rapport à une cible de 8e année pour les instruments destinés au grand public.`;
    if (simResult) p4 += ` La simulation (500 répondants synthétiques, paramètres ancrés dans les statistiques citées ci-dessus) estime un taux d'achèvement effectif de ${simResult.effective} %.`;

    recommend = highItems.length === 0 && openGaps.length === 0
      ? "Recommandation : procéder à la diffusion; continuer à surveiller les taux d'achèvement désagrégés conformément à l'élément de l'étape 5 de la liste de vérification."
      : `Recommandation : régler les lacunes de gravité élevée et de conformité signalées ci-dessus avant la diffusion, notamment ${(pick(highItems[0]?.text, lang) || pick(openGaps[0]?.gap, lang) || "les éléments mentionnés ci-dessus").slice(0, 90)}.`;

    return [`SOMMAIRE ACS+ — ${title}`, `Préparé le : ${new Date().toLocaleDateString("fr-CA")}`, "", p1, "", p2, "", p3, "", p4, "", recommend].join("\n");
  }

  p1 = `This survey instrument ("${title}") was reviewed using the GBA+ Survey Testing Twin against ${activeFactors.length} intersectional identity factor(s): ${factorNames}. ${checklist.length - unaddressed.length} of ${checklist.length} GBA+ checklist items are currently addressed.`;
  if (highItems.length) p1 += ` ${highItems.length} high-severity gap(s) remain, most notably: ${highItems.slice(0, 2).map(i => `"${pick(i.text, lang)}"`).join("; ")}.`;
  if (topClusters.length) p1 += ` These gaps cluster around ${topClusters.join(" and ")}, which tend to compound for the same respondents rather than acting independently.`;

  p2 = `Compliance review across ${applicable.length} framework(s) identified ${openGaps.length} open gap(s).`;
  if (openGaps.length) p2 += ` Most significant: ${pick(openGaps[0].gap, lang)} (${pick(openGaps[0].clause, lang)}).`;
  if (flaggedFrameworks.length) p2 += ` Note: ${flaggedFrameworks.map(f => pick(f.name, lang)).join(", ")} guidance should be reconfirmed before submission — ${pick(flaggedFrameworks[0].flagText, lang)}`;

  const onlineOnly = delivery.onlineOnly && !delivery.paper && !delivery.phone && !delivery.inPerson;
  const langOnly = langMode === "en_only" || langMode === "fr_only";
  p3 = "Based on current delivery and language settings, ";
  const exclusionNotes = [];
  if (onlineOnly) exclusionNotes.push(`an estimated ${Math.round(ADULT_POP * 0.05).toLocaleString()} Canadians (non-internet-users, StatCan CIUS 2022) may be structurally unable to access this instrument`);
  if (langOnly) exclusionNotes.push(`an estimated ${Math.round(ADULT_POP * 0.214).toLocaleString()} Canadians with a non-official mother tongue (2021 Census) may face added barriers`);
  if (!accessibleFormat) exclusionNotes.push(`the 27% of Canadians 15+ with a disability (CSD 2022) lack a confirmed accessible format`);
  p3 += exclusionNotes.length ? exclusionNotes.join("; ") + "." : "no major design-driven exclusion risks were flagged.";

  p4 = `Plain-language analysis estimates a Grade ${round(plainGrade, 1)} reading level against a Grade 8 target for general-public instruments.`;
  if (simResult) p4 += ` Simulation (500 synthetic respondents, parameters grounded in the cited statistics above) estimates an effective completion rate of ${simResult.effective}%.`;

  recommend = highItems.length === 0 && openGaps.length === 0
    ? "Recommendation: proceed to fielding; continue to monitor disaggregated completion rates per the Step 5 checklist item."
    : `Recommendation: address the flagged high-severity and compliance gaps above before fielding, particularly ${(pick(highItems[0]?.text, lang) || pick(openGaps[0]?.gap, lang) || "the items noted above").slice(0, 90)}.`;

  return [`GBA+ SUMMARY — ${title}`, `Prepared: ${new Date().toLocaleDateString("en-CA")}`, "", p1, "", p2, "", p3, "", p4, "", recommend].join("\n");
}

function Sec_Brief(props) {
  const { lang, t } = props;
  const [draft, setDraft] = useState(() => buildBriefingText(props));
  const [polishing, setPolishing] = useState(false);

  useEffect(() => { setDraft(buildBriefingText(props)); }, [props.meta.title, props.activeFactors.length, props.checklist, props.plainGrade, lang]);

  async function polish() {
    setPolishing(true);
    try {
      const resp = await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You tighten draft GBA+ summary paragraphs into Memorandum-to-Cabinet / Treasury Board submission tone: precise, neutral, evidence-led, no first person, no markdown formatting. Preserve every factual claim and citation exactly. ${lang === "fr" ? "Keep the response entirely in French." : "Keep the response entirely in English."} Respond ONLY with the revised text.`,
          messages: [{ role: "user", content: draft }],
        }),
      });
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${resp.status}`); }
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      if (raw) setDraft(raw);
    } catch (e) {
      setDraft(draft + "\n\n" + t("briefPolishFailed") + e.message + "]");
    } finally { setPolishing(false); }
  }

  return (
    <div>
      <span style={sLabel}>{t("briefLabel")}</span>
      <textarea value={draft} onChange={e => setDraft(e.target.value)} style={{ ...inputBase, width: "100%", minHeight: 320, resize: "vertical", marginBottom: 12, lineHeight: 1.6 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button style={btnPrimary(polishing)} onClick={polish} disabled={polishing}>{polishing ? t("briefPolishing") : "◆ " + t("briefPolishBtn")}</button>
        <button style={btnSec} onClick={() => navigator.clipboard.writeText(draft)}>{t("briefCopy")}</button>
        <button style={btnSec} onClick={() => setDraft(buildBriefingText(props))}>{t("briefRegenerate")}</button>
      </div>
    </div>
  );
}

/* ---------- Library: GBA+ resource library, organized by checklist step ---------- */
function LibraryTab({ lang }) {
  const t = useT(lang);

  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>{t("libDescription")}</p>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: T.hint, marginBottom: "1.5rem" }}>{t("libIntro")}</p>

      {GBA_STEPS.map((stepLabel, stepIdx) => {
        const items = CHECKLIST_ITEMS.filter(c => c.step === stepIdx + 1);
        const seen = new Set();
        const stepSources = [];
        items.forEach(item => {
          const ev = CHECKLIST_RESOURCES[item.id];
          if (!ev) return;
          ev.references.forEach(r => {
            if (!seen.has(r.url)) { seen.add(r.url); stepSources.push(r); }
          });
        });

        return (
          <div key={stepIdx} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.greenBg, color: T.greenTxt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{stepIdx + 1}</div>
              <p style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{pick(stepLabel, lang)}</p>
            </div>

            <div style={{ ...card, borderLeft: `3px solid ${T.green}` }}>
              <p style={{ ...sLabel, marginBottom: 6 }}>{t("libStepRecommendation")}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text }}>{pick(STEP_RECOMMENDATIONS[stepIdx], lang)}</p>
            </div>

            {stepSources.length > 0 && (
              <div style={card}>
                <p style={{ ...sLabel, marginBottom: 8 }}>{t("libSourcesForStep")}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {stepSources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blueTxt, border: `0.5px solid ${T.border}`, borderRadius: 20, padding: "4px 12px" }}>{pick(r.label, lang)} ↗</a>
                  ))}
                </div>
              </div>
            )}

            <p style={{ ...sLabel, margin: "1rem 0 8px" }}>{t("libItemsActions")}</p>
            <div style={{ display: "grid", gap: 8 }}>
              {items.map(item => {
                const ev = CHECKLIST_RESOURCES[item.id];
                return (
                  <div key={item.id} style={{ ...card, marginBottom: 0 }}>
                    <p style={{ fontSize: 13, color: T.text, lineHeight: 1.55, marginBottom: 8 }}>{pick(item.text, lang)}</p>
                    {ev && (
                      <div style={{ display: "grid", gap: 6 }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 500, color: T.greenTxt, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t("checklistQuickAction")}: </span>
                          <span style={{ fontSize: 12, color: T.text }}>{pick(ev.quickAction, lang)}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 500, color: T.amberTxt, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t("libRecommendationLabel")}: </span>
                          <span style={{ fontSize: 12, color: T.muted }}>{pick(ev.alternative, lang)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }}>
                          {ev.references.map((r, i) => (
                            <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: T.blueTxt }}>{pick(r.label, lang)} ↗</a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================== APP ROOT ============================== */
export default function App() {
  const [mainTab, setMainTab] = useState("synthesis");
  const [lang, setLang] = useState("en");
  const t = useT(lang);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: T.bg, color: T.text, minHeight: "100vh", padding: "1.5rem 1rem", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, color: T.text }}>{t("appTitle")}</h1>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>{t("appSubtitle")}</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.greenPill, color: T.greenTxt, fontSize: 11, fontWeight: 500, padding: "3px 12px", borderRadius: 20 }}>◆ {t("badgeText")}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} title={t("langToggleLabel")}>
          {["en", "fr"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "5px 12px", fontSize: 12, fontWeight: lang === l ? 500 : 400, borderRadius: 20, border: `0.5px solid ${lang === l ? T.green : T.border}`, background: lang === l ? T.greenBg : "transparent", color: lang === l ? T.greenTxt : T.muted, cursor: "pointer", fontFamily: "inherit" }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", border: `0.5px solid ${T.border}`, borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: "1.5rem" }}>
        <button onClick={() => setMainTab("synthesis")} style={{ padding: "8px 20px", fontSize: 13, fontWeight: mainTab === "synthesis" ? 500 : 400, cursor: "pointer", border: "none", borderRight: `0.5px solid ${T.border}`, background: mainTab === "synthesis" ? T.surface : "transparent", color: mainTab === "synthesis" ? T.text : T.muted, fontFamily: "inherit" }}>{t("tabSynthesis")}</button>
        <button onClick={() => setMainTab("twin")} style={{ padding: "8px 20px", fontSize: 13, fontWeight: mainTab === "twin" ? 500 : 400, cursor: "pointer", border: "none", borderRight: `0.5px solid ${T.border}`, background: mainTab === "twin" ? T.surface : "transparent", color: mainTab === "twin" ? T.text : T.muted, fontFamily: "inherit" }}>{t("tabTwin")}</button>
        <button onClick={() => setMainTab("library")} style={{ padding: "8px 20px", fontSize: 13, fontWeight: mainTab === "library" ? 500 : 400, cursor: "pointer", border: "none", background: mainTab === "library" ? T.surface : "transparent", color: mainTab === "library" ? T.text : T.muted, fontFamily: "inherit" }}>{t("navLibrary")}</button>
      </div>

      {mainTab === "synthesis" && <DocumentSynthesis lang={lang} />}
      {mainTab === "twin" && <SurveyTwin lang={lang} />}
      {mainTab === "library" && <LibraryTab lang={lang} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } input[type=checkbox]{ width:14px; height:14px; }`}</style>
    </div>
  );
}
