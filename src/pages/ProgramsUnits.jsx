import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "../styles/programs.css"; 
import { staffData } from "../components/staff/staffData"; 
 
const ProgramsUnits = () => { 
  const navigate = useNavigate(); 
 
  const [showContact, setShowContact] = useState(null); 
  const [selectedUnit, setSelectedUnit] = useState(null); 
 
  const units = [ 
    /* ========================================================= 
       1. ADMINISTRATION 
    ========================================================= */ 
    { 
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8", 
      iconBg: "bg-blue", 
      status: "Active Unit", 
      statusType: "green", 
      title: "Administration", 
      description: 
        "Strategic leadership, financial management, planning, monitoring, governance and corporate support services for the department.", 
      sections: [ 
        { 
          title: "Executive Support – Economic Cluster Secretariat & IGR", 
          about: [ 
            "Coordinates submissions for the Economic Sectors, Investment, Employment and Infrastructure Development Technical and Political Clusters.", 
            "Coordinates Intergovernmental Relations (IGR).", 
            "Coordinates major projects and helps remove implementation bottlenecks.", 
            "Key projects: Boegoebaai Port and Rail Development, Green Hydrogen Project and Namakwa SEZ.", 
          ], 
          needs: [ 
            "Economic Cluster meeting schedules and agendas", 
            "IGR coordination guidance", 
            "Mega-project progress updates", 
            "Presidential Imbizo coordination information", 
            "Guidance on referring matters to Economic Cluster / EXCO", 
          ], 
          documents: ["Content required from the responsible unit."], 
          services: [ 
            "IGR coordination", 
            "Mega-project implementation bottleneck resolution", 
            "Referral/recommendation of Cluster agenda items to EXCO", 
            "Presidential Imbizo departmental input coordination", 
          ], 
          news: [ 
            "Cluster meeting notices", 
            "Agenda submission deadlines", 
            "Boegoebaai updates", 
            "Green Hydrogen updates", 
            "Namakwa SEZ updates", 
            "Presidential Imbizo updates", 
          ], 
        }, 
        { 
          title: "Strategic Management / Strategic Planning", 
          about: [ 
            "Ensures compliance with legislative planning and reporting requirements.", 
            "Coordinates the APP, quarterly performance reports and Annual Report.", 
          ], 
          needs: [ 
            "APP submission deadlines", 
            "Quarterly report deadlines", 
            "Annual Report deadlines", 
            "Strategic/annual planning session dates", 
            "Reporting templates and formats", 
            "National Treasury / DPME reporting guidance", 
          ], 
          documents: [ 
            "Annual Performance Plan (APP)", 
            "Quarterly Performance Reports", 
            "Annual Report", 
            "Departmental outlook indicators template", 
          ], 
          services: [ 
            "Strategic and annual performance planning", 
            "Legislative reporting process", 
            "NCOP/SCOPA submission process", 
          ], 
          news: [ 
            "APP deadlines", 
            "Quarterly reporting deadlines", 
            "Annual reporting deadlines", 
            "Strategic planning sessions", 
            "Planning session outcomes", 
          ], 
        }, 
        { 
          title: "Monitoring & Evaluation (M&E)", 
          about: [ 
            "Monitors and evaluates departmental performance and economic development interventions.", 
            "Aligns departmental interventions with the NDP and PGDP.", 
            "Produces M&E reports.", 
            "Conducts verification and site visits.", 
          ], 
          needs: [ 
            "M&E reports", 
            "Verification/site visit schedules", 
            "M&E reporting templates", 
            "NDP/PGDP alignment guidance", 
            "Site visit coordination contact", 
          ], 
          documents: [ 
            "M&E monitoring reports", 
            "Economic Recovery and Growth reports", 
            "Tourism-supported establishment reports", 
            "Co-operative support reports", 
            "Evaluation reports", 
            "SMME economic recovery evaluation", 
            "Tourism SMME support evaluation", 
          ], 
          services: [ 
            "M&E process", 
            "Monitoring economic development interventions", 
            "Site verification process", 
          ], 
          news: [ 
            "New M&E reports", 
            "Evaluation reports", 
            "Verification visits", 
            "Site visit schedules", 
          ], 
        }, 
        { 
          title: "Risk Management", 
          about: [ 
            "Coordinates Enterprise Risk Management activities.", 
            "Supports the Risk and Ethics Management Committee.", 
          ], 
          needs: [ 
            "Risk & Ethics Management Committee Charter", 
            "ERM implementation plan", 
            "Risk registers/templates", 
            "Committee meeting schedule", 
            "Quarterly reporting requirements", 
          ], 
          documents: [ 
            "Risk Management Policy", 
            "Risk Management Strategy", 
            "Annual Risk Management Implementation Plan", 
            "Risk & Ethics Management Committee Charter", 
          ], 
          services: [ 
            "Enterprise Risk Management", 
            "Risk identification", 
            "Risk assessment", 
            "Strategic risk management", 
            "Operational risk management", 
          ], 
          news: [ 
            "Committee meeting dates", 
            "Committee outcomes", 
            "Risk awareness updates", 
          ], 
        }, 
        { 
          title: "Governance", 
          about: [ 
            "Provides oversight of public entities reporting to the MEC.", 
            "Entities include NCEDA, Northern Cape Gambling Board and Northern Cape Liquor Board.", 
            "Reviews quarterly and compliance reports.", 
            "Facilitates transfer payments.", 
          ], 
          needs: [ 
            "Public entity list and contacts", 
            "Quarterly/compliance reporting templates", 
            "Transfer payment information", 
            "Entity APP/Annual Report review process", 
            "Audit Committee schedules", 
          ], 
          documents: [ 
            "Entity quarterly reports", 
            "Compliance reports", 
            "Entity Annual Reports", 
            "Entity APPs", 
            "Transfer payment schedules", 
          ], 
          services: [ 
            "Public entity oversight", 
            "Governance process", 
            "Transfer payment facilitation", 
          ], 
          news: [ 
            "Transfer payment announcements", 
            "Entity governance updates", 
            "Oversight updates", 
          ], 
        }, 
        { 
          title: "Financial Management", 
          about: [ 
            "Manages departmental finances.", 
            "Includes SCM, invoice payments, budget monitoring and financial reporting.", 
            "Ensures compliance with SCM prescripts and cost containment requirements.", 
          ], 
          needs: [ 
            "Invoice payment status and turnaround", 
            "SCM procedures and forms", 
            "Budget/expenditure reports", 
            "Cost containment guidelines", 
            "Designated-groups procurement database", 
          ], 
          documents: [ 
            "SCM procurement forms", 
            "SCM prescripts", 
            "Cost Containment guidelines/instructions", 
            "Budget and expenditure reports", 
          ], 
          services: [ 
            "30-day invoice payment process", 
            "SCM procurement process", 
            "Budget monitoring", 
            "Budget reprioritisation", 
          ], 
          news: ["Content required."], 
        }, 
      ], 
      tags: ["Strategic Support", "Finance", "Governance"], 
    }, 
 
    /* ========================================================= 
       2. CORPORATE SERVICES 
    ========================================================= */ 
    { 
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", 
      iconBg: "bg-orange", 
      status: "Stable", 
      statusType: "gray", 
      title: "Corporate Services", 
      description: 
        "Provides human resource administration, organisational development, legal services, performance management, wellness and labour relations support.", 
      sections: [ 
        { 
          title: "Human Resource Administration (HRA)", 
          about: [ 
            "Manages recruitment and staffing.", 
            "Coordinates recruitment drives for vacant funded posts.", 
            "Supports adequate staffing for departmental delivery.", 
          ], 
          needs: [ 
            "Vacant posts", 
            "Recruitment process", 
            "Recruitment & Selection Policy", 
            "New employee onboarding", 
            "HR Plan", 
            "Recruitment contact", 
          ], 
          documents: [ 
            "HR Plan", 
            "Recruitment & Selection Policy", 
            "Public Service Regulations", 
          ], 
          services: ["Recruitment process for vacant funded posts"], 
          news: ["Recruitment drives", "Vacancy announcements"], 
        }, 
        { 
          title: "Organisational Development & Legal Services", 
          about: [ 
            "Develops organisational structures and organograms.", 
            "Supports organisational restructuring.", 
            "Drafts MOUs and supporting legislation.", 
          ], 
          needs: [ 
            "Approved organogram", 
            "MOU templates", 
            "Organisational review updates", 
            "Legal drafting process", 
            "Legal Services contact", 
          ], 
          documents: [ 
            "Approved departmental organogram", 
            "MOU templates", 
          ], 
          services: [ 
            "Organisational review/restructuring", 
            "Legal drafting", 
            "MOU support", 
          ], 
          news: [ 
            "Organisational restructuring", 
            "Mega Entity developments", 
            "Gambling and Liquor Board merger updates", 
          ], 
        }, 
        { 
          title: "Employee Performance Management & Development System (EPMDS)", 
          about: [ 
            "Manages employee performance management.", 
            "Monitors compliance.", 
            "Supports consequence management.", 
          ], 
          needs: [ 
            "Provincial EPMDS Policy", 
            "EPMDS deadlines", 
            "Performance agreement templates", 
            "Work plan templates", 
            "PDP templates", 
            "Compliance information", 
          ], 
          documents: [ 
            "Provincial EPMDS Policy", 
            "Performance agreement template", 
            "Work plan template", 
            "PDP template", 
            "Consequence management guidelines", 
          ], 
          services: [ 
            "EPMDS submission", 
            "Compliance process", 
            "Performance management", 
            "Consequence management", 
          ], 
          news: ["EPMDS deadlines", "Compliance updates"], 
        }, 
        { 
          title: "Employee Health & Wellness (EHW)", 
          about: [ 
            "Implements Employee Health and Wellness policies.", 
            "Promotes a healthy and supportive work environment.", 
            "Conducts wellness events, screenings and outreach.", 
          ], 
          needs: [ 
            "EHW policies", 
            "Wellness calendar", 
            "Employee information sessions", 
            "Wellness/counselling support", 
            "Diversity Management information", 
          ], 
          documents: [ 
            "Four EHW policies", 
            "Quarterly information session materials", 
          ], 
          services: [ 
            "Employee Wellness Programme", 
            "Diversity Management", 
            "Awareness sessions", 
          ], 
          news: [ 
            "Women's Day", 
            "Men's Day", 
            "GEMS screenings", 
            "Outreach programmes", 
            "Quarterly information sessions", 
          ], 
        }, 
        { 
          title: "Labour Relations", 
          about: [ 
            "Manages labour relations.", 
            "Supports the departmental ethics programme.", 
          ], 
          needs: [ 
            "Code of Conduct", 
            "Labour relations case process", 
            "Ethics Programme", 
            "Disciplinary process", 
            "Labour Relations contact", 
          ], 
          documents: [ 
            "Code of Conduct for Public Service", 
            "Fraud Prevention & Ethics Management Strategy", 
            "Whistle-blowing Policy", 
          ], 
          services: [ 
            "Labour relations process", 
            "Disciplinary process", 
            "Whistle-blowing", 
            "Conflict of interest declaration", 
            "E-Disclosure for SMS/MMS/SCM officials", 
          ], 
          news: [ 
            "Ethics Programme updates", 
            "Code of Conduct awareness sessions", 
          ], 
        }, 
      ], 
      tags: ["Human Resources", "Legal", "Employee Services"], 
    }, 
 
    /* ========================================================= 
       3. INTEGRATED ECONOMIC DEVELOPMENT SERVICES 
    ========================================================= */ 
    { 
      icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", 
      iconBg: "bg-green", 
      status: "Active", 
      statusType: "green", 
      title: "Integrated Economic Development Services", 
      description: 
        "Promotes economic and small-business development, supports municipalities and strengthens economic empowerment initiatives.", 
      sections: [ 
        { 
          title: "Regional & Local Economic Development (RaLED)", 
          about: [ 
            "Promotes economic and small-business development.", 
            "Supports municipalities with economic development planning.", 
            "Supports LED strategies and IDP components.", 
            "Coordinates Red Tape Reduction.", 
            "Oversees KIDJA and KDJI.", 
          ], 
          needs: [ 
            "Municipal LED support", 
            "Section 47 analysis", 
            "LED Forum schedule", 
            "EPWP application process", 
            "KIDJA/KDJI training", 
            "Northern Cape Blended SMME Fund", 
          ], 
          documents: [ 
            "LED strategies", 
            "Business plans", 
            "Project proposals", 
            "EPWP project reports", 
          ], 
          services: [ 
            "Municipal LED and IDP support", 
            "Red Tape Reduction", 
            "EPWP grant process", 
            "Northern Cape Blended SMME Fund", 
            "TREGF applications", 
            "KIDJA/KDJI incubation", 
            "Learnership programmes", 
          ], 
          news: [ 
            "LED Forum dates/outcomes", 
            "EPWP announcements", 
            "KIDJA/KDJI achievements", 
            "Learner achievements", 
            "Market-access achievements", 
          ], 
        }, 
        { 
          title: "Economic Empowerment, Preferential Procurement & BBBEE", 
          about: [ 
            "Supports SMMEs and co-operatives.", 
            "Provides financial and non-financial support.", 
            "Focuses on economic empowerment, preferential procurement and BBBEE.", 
            "Supports youth, women and persons with disabilities.", 
          ], 
          needs: [ 
            "CIPC services", 
            "BBBEE certification", 
            "BBBEE workshops", 
            "SMME/co-operative funding", 
            "PPI information", 
            "Youth/women/PWD programmes", 
          ], 
          documents: [ 
            "BBBEE Act guidance", 
            "CIPC service forms", 
            "PPI opportunity briefs", 
          ], 
          services: [ 
            "Company registration", 
            "Annual returns", 
            "BBBEE certification", 
            "BBBEE verification workshops", 
            "Preferential Procurement Initiatives", 
            "Youth/women/PWD entrepreneurship support", 
          ], 
          news: [ 
            "BBBEE workshops", 
            "Youth Entrepreneurship Tour", 
            "Women's Month", 
            "Disability Rights Awareness Month", 
            "NEF success stories", 
            "Northern Cape Blended Fund success stories", 
          ], 
        }, 
      ], 
      tags: ["SMME Support", "LED", "Economic Empowerment"], 
    }, 
 
    /* ========================================================= 
       4. TRADE & SECTOR DEVELOPMENT 
    ========================================================= */ 
    { 
      icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", 
      iconBg: "bg-green", 
      status: "Active", 
      statusType: "green", 
      title: "Trade & Sector Development", 
      description: 
        "Develops key economic sectors, promotes trade and investment, and supports major provincial economic projects.", 
      sections: [ 
        { 
          title: "Sector Development", 
          about: [ 
            "Develops and industrialises key economic sectors.", 
            "Focus areas include Metals, Machinery & Equipment, Mining, Mineral beneficiation and Renewable energy.", 
            "Supports sector master plans, stakeholders and SMMEs.", 
          ], 
          needs: [ 
            "MME Industrial Cluster Masterplan", 
            "Mining sector support", 
            "SLP analysis", 
            "NOCSOBI rooftop solar programme", 
            "Sector engagement calendar", 
            "Export/GI support", 
          ], 
          documents: [ 
            "MME Industrial Cluster Masterplan", 
            "Northern Cape Manufacturing Strategy", 
            "PV Green Card certification guidance", 
          ], 
          services: [ 
            "Sector master planning", 
            "Mining engagement", 
            "SLP impact analysis", 
            "NOCSOBI rooftop solar PV programme", 
            "Agro-processing export support", 
            "GI registration support", 
          ], 
          news: [ 
            "MME Masterplan milestones", 
            "Mining sector updates", 
            "Kgatelopele Economic Diversification Working Group", 
            "NOCSOBI PV Green Card certifications", 
            "Export/trade workshops", 
          ], 
        }, 
        { 
          title: "Trade & Investment Promotion", 
          about: [ 
            "Promotes trade and investment.", 
            "Markets Northern Cape investment opportunities.", 
            "Supports catalytic and mega-projects.", 
            "Supports export readiness.", 
          ], 
          needs: [ 
            "Investment/trade marketing materials", 
            "Global Exporter Programme", 
            "NCEDA project updates", 
            "Trade Invest Africa newsletter", 
            "Exhibition/trade mission opportunities", 
          ], 
          documents: [ 
            "NC Business Publication", 
            "Trade Invest Africa newsletter", 
            "Africa Decisions Magazine features", 
          ], 
          services: [ 
            "Export awareness", 
            "GEPP training", 
            "Investment marketing", 
            "Investment matchmaking", 
            "NCEDA project oversight", 
          ], 
          projects: [ 
            "Namakwa SEZ", 
            "Boegoebaai Port & Rail", 
            "Green Hydrogen", 
            "Upington Industrial Park", 
            "Kathu Industrial Park", 
          ], 
          news: [ 
            "GEPP training dates", 
            "Investment project features", 
            "Trade missions", 
            "Investment exhibitions", 
          ], 
        }, 
      ], 
      tags: ["Trade", "Mining", "Investment"], 
    }, 
 
    /* ========================================================= 
       5. CONSUMER PROTECTION & BUSINESS REGULATION 
    ========================================================= */ 
    { 
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", 
      iconBg: "bg-blue", 
      status: "Regulated", 
      statusType: "green", 
      title: "Consumer Protection & Business Regulation", 
      description: 
        "Protects consumers, handles complaints, supports fair business practices and manages provincial consumer regulation.", 
      sections: [ 
        { 
          title: "Consumer Protection", 
          about: [ 
            "Handles consumer complaints throughout the province.", 
            "Investigates, mediates and adjudicates complaints.", 
            "Protects consumers under the Northern Cape Consumer Protection Act.", 
          ], 
          needs: [ 
            "How to lodge a complaint", 
            "Consumer education schedule", 
            "Business compliance inspection", 
            "Complaint resolution process", 
            "Consumer complaint contact", 
          ], 
          documents: [ 
            "Northern Cape Consumer Protection Act", 
            "Complaint lodging form", 
            "Compliance notice templates", 
          ], 
          services: [ 
            "Complaint investigation", 
            "Mediation", 
            "Adjudication", 
            "Business premises inspections", 
            "Multi-disciplinary task team operations", 
          ], 
          news: [ 
            "World Consumer Rights Day", 
            "Consumer education programmes", 
            "District awareness programmes", 
            "Blitz/raid outcomes", 
          ], 
        }, 
        { 
          title: "Northern Cape Consumer Court", 
          about: [ 
            "Adjudicates unresolved consumer matters referred by the Office of the Consumer Protector.", 
          ], 
          needs: [ 
            "Referral process", 
            "Court sitting schedule", 
            "Adjudication process", 
            "Required documentation", 
            "Court contact", 
          ], 
          documents: [ 
            "Consumer Court referral form", 
            "Adjudication process guide", 
          ], 
          services: [ 
            "Referral of unresolved consumer complaints", 
            "Consumer Court adjudication process", 
          ], 
          news: ["Court sitting dates", "Case outcomes"], 
        }, 
        { 
          title: "Business Regulation", 
          about: [ 
            "Intended to manage and facilitate business regulatory services in the province.", 
            "Organogram has been approved.", 
            "Currently unfunded/unresourced.", 
            "Pending post-filling and new provincial legislation.", 
          ], 
          needs: ["To Be Confirmed"], 
          documents: ["To Be Confirmed"], 
          services: ["To Be Confirmed"], 
          news: ["To Be Confirmed"], 
        }, 
      ], 
      tags: ["Consumer Protection", "Compliance", "Regulation"], 
    }, 
 
    /* ========================================================= 
       6. ECONOMIC PLANNING 
    ========================================================= */ 
    { 
      icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", 
      iconBg: "bg-orange", 
      status: "Planning", 
      statusType: "gray", 
      title: "Economic Planning", 
      description: 
        "Provides economic intelligence, research, policy development, knowledge economy support and strategic planning.", 
      sections: [ 
        { 
          title: "Economic Research & Policy Development (EPRD)", 
          about: [ 
            "Promotes integrated economic planning.", 
            "Coordinates the PGDP economic driver.", 
            "Reviews economic policies and strategies.", 
            "Conducts economic research.", 
            "Produces Economic Intelligence reports.", 
          ], 
          needs: [ 
            "Economic Intelligence reports", 
            "Economic Transformation & Job Creation Implementation Forum", 
            "Policy/strategy review status", 
            "Economic Overview reports", 
            "Research/policy request contact", 
          ], 
          documents: [ 
            "Economic Intelligence reports", 
            "Economic Overview reports", 
            "Northern Cape Reconstruction & Recovery Plan", 
            "Agriculture & Agro-processing Masterplan", 
            "Oceans Economy Strategy", 
          ], 
          services: [ 
            "Economic policy review", 
            "Strategy review", 
            "Economic Intelligence requests", 
            "Implementation Forum", 
            "MEC Vote speech compilation support", 
          ], 
          news: [ 
            "New Economic Intelligence reports", 
            "Forum dates/outcomes", 
            "Economic Symposiums", 
          ], 
        }, 
        { 
          title: "Knowledge Economy Support (KES)", 
          about: [ 
            "Develops the knowledge economy in the Northern Cape.", 
            "Focus areas include Knowledge Management Systems, Broadband/WiFi, Digital infrastructure, Digital literacy, ICT entrepreneurship and SKA localisation initiatives.", 
          ], 
          needs: [ 
            "Broadband/SA Connect rollout", 
            "Digital literacy training", 
            "ICT entrepreneurship opportunities", 
            "Carnarvon Science Exploratorium updates", 
            "KES e-forms", 
            "Northern Cape Innovation Forum information", 
          ], 
          documents: [ 
            "Planning Forum stakeholder database", 
            "Tourist Incident Report e-form", 
            "Illegal Tourist Guiding Report e-form", 
            "Visitor Tracking System documentation", 
          ], 
          services: [ 
            "SA Connect broadband rollout", 
            "Digital skills training", 
            "ICT entrepreneurship programmes", 
            "WISP cooperative development", 
            "Carnarvon Science Exploratorium", 
            "Visitor Tracking System deployment", 
          ], 
          news: [ 
            "SA Connect rollout milestones", 
            "Carnarvon Science Exploratorium updates", 
            "Digital skills training dates", 
            "WISP cooperative registration", 
          ], 
          maintainer: [ 
            "Rodwyn Grewan", 
            "Senior Manager: Knowledge Economy Support", 
            "Direct phone/email: To be confirmed before publication", 
          ], 
        }, 
      ], 
      tags: ["Economic Intelligence", "Research", "Knowledge Economy"], 
    }, 
 
    /* ========================================================= 
       7. TOURISM 
    ========================================================= */ 
    { 
      icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-9m9-9s-1.343-9-3-9", 
      iconBg: "bg-green", 
      status: "High Growth", 
      statusType: "green", 
      title: "Tourism", 
      description: 
        "Develops and promotes Northern Cape as a tourism destination through tourism enterprise support, routes, investment, infrastructure and sustainable growth.", 
      sections: [ 
        { 
          title: "Tourism Development", 
          about: [ 
            "Leads tourism growth and destination promotion.", 
            "Supports tourism enterprises.", 
            "Enhances visitor experience.", 
            "Supports tourism infrastructure.", 
            "Promotes industry compliance.", 
          ], 
          needs: [ 
            "Tourism enterprise support", 
            "Tourist routes", 
            "Tourism infrastructure projects", 
            "Grant compliance workshops", 
            "Stakeholder directory", 
          ], 
          documents: [ 
            "Tourism enterprise support guidelines", 
            "Grant Transfer Agreement", 
            "Compliance reporting template", 
            "Tourist route maps", 
            "Walking trail guides", 
          ], 
          routes: [ 
            "Quiver Tree Route", 
            "Forgotten Highway", 
            "Karoo Oasis", 
            "Kalahari Red Dune Routes", 
            "Carnarvon trails", 
            "Sutherland trails", 
            "Fraserburg trails", 
            "Williston trails", 
          ], 
          services: [ 
            "Tourism financial support", 
            "Non-financial support", 
            "Market access", 
            "Incubation", 
            "Infrastructure development", 
            "Grant compliance", 
            "Monitoring", 
            "Open for Business employment initiative", 
          ], 
          news: [ 
            "Africa's Travel Indaba", 
            "New route launches", 
            "Trail launches", 
            "Witsand glamping", 
            "Riemvasmaak Day Spa", 
            "Tourism Investment Forum Africa", 
            "Joyous Celebrations", 
          ], 
        }, 
        { 
          title: "Tourism Growth", 
          about: [ 
            "Promotes inclusive, sustainable and integrated tourism growth.", 
            "Supports local/township tourism planning.", 
            "Tourism data mapping.", 
            "Tourism investment.", 
            "Tourism safety.", 
            "Tourist guide compliance and training.", 
          ], 
          needs: [ 
            "Local Tourism Plans", 
            "Township Tourism Strategy", 
            "Visitor Tracking System", 
            "Tourism safety information", 
            "Tourist guide licensing", 
          ], 
          documents: [ 
            "Township Tourism Strategy", 
            "Visitor Tracking System reports", 
            "Tourism investment opportunities booklet", 
            "Tour operator workshop materials", 
          ], 
          services: [ 
            "Local Tourism Forums", 
            "Tourism investment facilitation", 
            "Tourism safety campaigns", 
            "Illegal tourist guiding compliance", 
            "Tourist guide licence renewal", 
            "Tour operator training", 
            "Nature/field guide training", 
          ], 
          news: ["To Be Confirmed"], 
        }, 
      ], 
      tags: ["Tourism Routes", "Tourism Development", "Investment"], 
    }, 
  ]; 
 
  return ( 
    <section className="programmes-section"> 
 
      {/* ========================================== 
          HEADER 
      ========================================== */} 
 
      <div className="header-controls"> 
 
        <div className="header-content"> 
 
          <h1 className="page-title"> 
            Programmes & Units 
          </h1> 
 
          <p className="page-description"> 
            Central hub for the Northern Cape Department of Economic 
            Development and Tourism. Access departmental resources, 
            specialised information, services and programme workspaces. 
          </p> 
 
        </div> 
 
      </div> 
 
 
      {/* ========================================== 
          UNITS 
      ========================================== */} 
 
      <div className="units-grid"> 
 
        {units.map((unit) => ( 
 
          <UnitCard 
            key={unit.title} 
            {...unit} 
            navigate={navigate} 
            setShowContact={setShowContact} 
            setSelectedUnit={setSelectedUnit} 
          /> 
 
        ))} 
 
      </div> 
 
 
      {/* ========================================== 
          BOTTOM SECTION 
      ========================================== */} 
 
      <div className="bottom-section"> 
 
        <div className="knowledge-portal"> 
 
          <h2 className="portal-title"> 
            Departmental Knowledge Portal 
          </h2> 
 
          <div className="stats-grid"> 
 
            <div className="stat-card"> 
 
              <p> 
                Total Programmes 
              </p> 
 
              <h2> 
                {units.length} 
              </h2> 
 
            </div> 
 
 
            <div className="stat-card"> 
 
              <p> 
                Active Units 
              </p> 
 
              <h2> 
                { 
                  units.filter( 
                    (unit) => 
                      unit.status === "Active Unit" || 
                      unit.status === "Active" 
                  ).length 
                } 
              </h2> 
 
            </div> 
 
 
            <div className="stat-card"> 
 
              <p> 
                Information Areas 
              </p> 
 
              <h2> 
                { 
                  units.reduce( 
                    (total, unit) => 
                      total + unit.sections.length, 
                    0 
                  ) 
                } 
              </h2> 
 
            </div> 
 
          </div> 
 
        </div> 
 
 
        {/* ========================================== 
            SUPPORT CARD 
        ========================================== */} 
 
        <div className="support-card"> 
 
          <h2> 
            Need Workspace Support? 
          </h2> 
 
          <p> 
            Contact IT Support for portal assistance. 
          </p> 
 
          <button 
            type="button" 
            onClick={() => navigate("/support")} 
          > 
            Get Help Now 
          </button> 
 
        </div> 
 
      </div> 
 
 
      {/* ========================================== 
          CONTACT POPUP 
      ========================================== */} 
 
      {showContact && ( 
 
        <div className="contact-overlay"> 
 
          <div 
            className="contact-popup" 
            style={{ maxHeight: "85vh", overflowY: "auto" }} 
          > 
 
            <button 
              className="close-popup" 
              onClick={() => setShowContact(false)} 
            > 
              × 
            </button> 
 
 
            <h2> 
              {showContact.title} Contacts
            </h2> 
 
 
            <p> 
              Contact the relevant staff members for this programme. 
            </p> 
 
            {staffData
              .filter((staffMember) => staffMember.programme === showContact.programme)
              .map((staffMember) => (
                <div className="contact-details" key={staffMember.id}>
                  <p><strong>{staffMember.fullName}</strong></p>
                  <p>{staffMember.jobTitle}</p>
                  <p>{staffMember.componentDescription}</p>
                  <p>📧 <a href={`mailto:${staffMember.email}`}>{staffMember.email}</a></p>
                  <p>
                    ☎ {staffMember.phone
                      ? <a href={`tel:${staffMember.phone}`}>{staffMember.phone}</a>
                      : "Phone not available"}
                  </p>
                  <p>🏢 {staffMember.location}</p>
                </div>
              ))}
 
 
            <button 
              className="workspace-btn" 
              onClick={() => setShowContact(false)} 
            > 
              Close 
            </button> 
 
          </div> 
 
        </div> 
 
      )} 
 
 
      {/* ========================================== 
          UNIT INFORMATION POPUP 
      ========================================== */} 
 
      {selectedUnit && ( 
 
        <div className="contact-overlay"> 
 
          <div 
            className="contact-popup" 
            style={{ 
              maxWidth: "900px", 
              maxHeight: "85vh", 
              overflowY: "auto", 
            }} 
          > 
 
            <button 
              className="close-popup" 
              onClick={() => setSelectedUnit(null)} 
            > 
              × 
            </button> 
 
 
            <h2> 
              {selectedUnit.title} 
            </h2> 
 
 
            {selectedUnit.sections.map((section) => ( 
 
              <div 
                key={section.title} 
                style={{ 
                  marginBottom: "30px", 
                  textAlign: "left", 
                }} 
              > 
 
                <h3> 
                  {section.title} 
                </h3> 
 
 
                {/* ABOUT */} 
 
                {section.about && ( 
 
                  <div> 
 
                    <h4> 
                      About 
                    </h4> 
 
                    <ul> 
                      {section.about.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* EMPLOYEE NEEDS */} 
 
                {section.needs && ( 
 
                  <div> 
 
                    <h4> 
                      Employee Needs 
                    </h4> 
 
                    <ul> 
                      {section.needs.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* DOCUMENTS */} 
 
                {section.documents && ( 
 
                  <div> 
 
                    <h4> 
                      Documents / Resources 
                    </h4> 
 
                    <ul> 
                      {section.documents.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* SERVICES */} 
 
                {section.services && ( 
 
                  <div> 
 
                    <h4> 
                      Services / Processes 
                    </h4> 
 
                    <ul> 
                      {section.services.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* PROJECTS */} 
 
                {section.projects && ( 
 
                  <div> 
 
                    <h4> 
                      Projects 
                    </h4> 
 
                    <ul> 
                      {section.projects.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* ROUTES */} 
 
                {section.routes && ( 
 
                  <div> 
 
                    <h4> 
                      Routes 
                    </h4> 
 
                    <ul> 
                      {section.routes.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* NEWS */} 
 
                {section.news && ( 
 
                  <div> 
 
                    <h4> 
                      News / Updates 
                    </h4> 
 
                    <ul> 
                      {section.news.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
 
                {/* CONTENT MAINTAINER */} 
 
                {section.maintainer && ( 
 
                  <div> 
 
                    <h4> 
                      Content Maintainer 
                    </h4> 
 
                    <ul> 
                      {section.maintainer.map((item) => ( 
                        <li key={item}> 
                          {item} 
                        </li> 
                      ))} 
                    </ul> 
 
                  </div> 
 
                )} 
 
              </div> 
 
            ))} 
 
 
            <button 
              className="workspace-btn" 
              onClick={() => setSelectedUnit(null)} 
            > 
              Close 
            </button> 
 
          </div> 
 
        </div> 
 
      )} 
 
    </section> 
  ); 
}; 
 
 
/* ========================================================= 
   UNIT CARD 
========================================================= */ 
 
function UnitCard({ 
  icon, 
  iconBg, 
  status, 
  statusType, 
  title, 
  description, 
  tags, 
  sections, 
  navigate, 
  setShowContact, 
  setSelectedUnit, 
}) { 
 
  return ( 
 
    <div className="unit-card"> 
 
 
      {/* ========================================== 
          UNIT HEADER 
      ========================================== */} 
 
      <div className="unit-header"> 
 
        <div className={`unit-icon ${iconBg}`}> 
 
          <svg 
            className="icon-large" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          > 
 
            <path 
              d={icon} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
            /> 
 
          </svg> 
 
        </div> 
 
 
        <span className={`status-badge ${statusType}`}> 
          {status} 
        </span> 
 
      </div> 
 
 
      {/* ========================================== 
          UNIT CONTENT 
      ========================================== */} 
 
      <h3 className="unit-title"> 
        {title} 
      </h3> 
 
 
      <p className="unit-description"> 
        {description} 
      </p> 
 
 
      {/* ========================================== 
          INFORMATION TAGS 
      ========================================== */} 
 
      <div className="unit-tags"> 
 
        {tags.map((tag) => ( 
 
          <span 
            key={tag} 
            className="unit-tag" 
          > 
            {tag} 
          </span> 
 
        ))} 
 
      </div> 
 
 
      {/* ========================================== 
          CARD ACTIONS 
      ========================================== */} 
 
      <div className="unit-card-actions"> 
 
        {/* ENTER WORKSPACE - TOP */} 
 
        <button 
          type="button" 
          className="workspace-btn workspace-main-btn" 
          onClick={() => 
            setSelectedUnit({ 
              title, 
              sections, 
            }) 
          } 
        > 
          Enter Workspace 
        </button> 
 
 
        {/* POLICIES + CONTACTS - BELOW */} 
 
        <div className="secondary-actions"> 
 
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={() => navigate("/policies")} 
          > 
            Policies 
          </button> 
 
 
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={() => setShowContact({
              title,
              programme: title === "Consumer Protection & Business Regulation"
                ? "BUSINESS REGULATION & GOVERNANCE"
                : title.toUpperCase(),
            })} 
          > 
            Contacts 
          </button> 
 
        </div> 
 
      </div> 
 
    </div> 
 
  ); 
} 
 
 
export default ProgramsUnits;