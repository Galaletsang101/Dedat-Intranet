import { useMemo, useState } from "react";
import { Container, Button } from "react-bootstrap";
import "../styles/dashboard.css";

const featuredSpaces = [
  {
    title: "Regional Development 2025",
    badge: "TRENDING",
    description:
      "The core planning workspace for the upcoming Provincial Economic Framework focusing on sustainable growth.",
    members: "42 Active Members",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Tourism Strategy Hub",
    detail: "Coordinating regional tourism initiatives.",
    badge: "NEW UPDATE",
    tone: "primary",
  },
  {
    title: "Project Management CoP",
    detail: "Sharing best practices for governance.",
    badge: "12 new posts",
    tone: "alt",
  },
];

const workspaces = [
  {
    title: "Economic Research Team",
    description: "Data analysis and economic forecasting for Northern Cape development.",
    members: "15 members",
    status: "ACTIVE",
    icon: "📊",
    button: "Enter",
    type: "light",
    kind: "team",
  },
  {
    title: "Policy Reform Group",
    description: "Collaborative drafting and review of departmental policy shifts.",
    members: "28 members",
    status: "STABLE",
    icon: "📘",
    button: "Join Space",
    type: "outline",
    kind: "cop",
  },
];

const activityItems = [
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    name: "Sarah Khumalo",
    text: "posted in Economic Research",
    comment: '"Just uploaded the Q3 Mining report summary."',
    likes: 12,
    replies: 4,
    time: "15m ago",
  },
  {
    avatarLabel: "🔗",
    name: "Team Workspace",
    text: "added 4 files to Tourism Hub",
    time: "2h ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    name: "John Molefe",
    text: "started a discussion: Improving SME Grant Access",
    time: "4h ago",
  },
];

const resources = [
  { icon: "📄", title: "Strategic Plan Template", meta: "DOCX • 1.2 MB" },
  { icon: "📊", title: "Budget Reporting Sheet", meta: "XLSX • 450 KB" },
  { icon: "📽", title: "DEDAT Brand Guide", meta: "PDF • 8.4 MB" },
];

const workspaceFilters = ["All", "Teams", "CoPs"];

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleActivityCount, setVisibleActivityCount] = useState(2);
  const [helperMessage, setHelperMessage] = useState("Search, filter, and join spaces from the dashboard.");
  const [votes, setVotes] = useState({
    "Unified Data Dashboard": 152,
    "Remote Work Hubs": 89,
  });
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedFeatured, setSelectedFeatured] = useState(featuredSpaces[0].title);
  const [activityFeed, setActivityFeed] = useState(activityItems);
  const [expandedActivity, setExpandedActivity] = useState(activityItems[0].name + activityItems[0].time);

  const filteredWorkspaces = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return workspaces.filter((space) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Teams" && space.kind === "team") ||
        (activeFilter === "CoPs" && space.kind === "cop");

      const matchesSearch =
        !query ||
        [space.title, space.description, space.members, space.status]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const visibleActivities = activityFeed.slice(0, visibleActivityCount);
  const activeFeaturedSpace = featuredSpaces.find((space) => space.title === selectedFeatured) ?? featuredSpaces[0];

  const handleVote = (idea) => {
    setVotes((currentVotes) => ({
      ...currentVotes,
      [idea]: (currentVotes[idea] ?? 0) + 1,
    }));
    setHelperMessage(`You voted for ${idea}. Thanks for supporting the idea.`);
  };

  const handleWorkspaceAction = (spaceTitle) => {
    setHelperMessage(`${spaceTitle} is now available in your quick-access list.`);
  };

  const handleResourceClick = (resourceTitle) => {
    setSelectedResource(resourceTitle);
    setHelperMessage(`${resourceTitle} was added to your downloads queue.`);
  };

  const handleLoadMore = () => {
    setVisibleActivityCount((currentCount) => Math.min(currentCount + 1, activityFeed.length));
    setHelperMessage("Showing more recent activity.");
  };

  const handleFeaturedClick = (title) => {
    setSelectedFeatured(title);
    setHelperMessage(`${title} is now highlighted as the featured community preview.`);
  };

  const handleActivityAction = (itemId, action) => {
    setActivityFeed((currentFeed) =>
      currentFeed.map((item) => {
        if ((item.name + item.time) !== itemId) {
          return item;
        }

        if (action === "like") {
          return {
            ...item,
            likes: (item.likes ?? 0) + 1,
          };
        }

        return {
          ...item,
          replies: (item.replies ?? 0) + 1,
        };
      })
    );

    setHelperMessage(
      action === "like" ? "You liked that activity update." : "Reply thread opened for this activity."
    );
  };

  const handleActivityToggle = (itemId) => {
    setExpandedActivity((currentId) => (currentId === itemId ? "" : itemId));
    setHelperMessage("Activity details updated.");
  };

  return (
    <div className="dashboard-shell">
      <Container fluid className="dashboard-page">
        <header className="dashboard-topbar">
          <div className="dashboard-brand">Digital Workplace</div>
          <div className="dashboard-topbar-actions">
            <div className="dashboard-search-wrap">
              <input
                className="dashboard-search"
                placeholder="Search spaces, projects..."
                aria-label="Search spaces"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <button className="dashboard-icon-btn" type="button" onClick={() => setHelperMessage("Notifications panel opened.")}>
              🔔
            </button>
            <button className="dashboard-icon-btn" type="button" onClick={() => setHelperMessage("Apps menu opened.")}>
              ⌘
            </button>
            <button className="dashboard-icon-btn" type="button" onClick={() => setHelperMessage("Help panel opened.")}>
              ?
            </button>
            <img
              alt="User profile"
              className="dashboard-avatar"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
            />
          </div>
        </header>

        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <h1>Collaboration Spaces</h1>
            <p>
              Connect with colleagues, share departmental knowledge, and drive
              cross-functional regional development projects in real-time.
            </p>
            <div className="dashboard-inline-note">{helperMessage}</div>
          </div>
          <Button
            className="dashboard-cta"
            type="button"
            onClick={() => setHelperMessage("A new collaboration draft is ready to start.")}
          >
            <span>＋</span>
            Start New Collaboration
          </Button>
        </section>

        <div className="dashboard-layout">
          <div className="dashboard-main-column">
            <section className="dashboard-section-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Featured Communities</h2>
                <button className="dashboard-link-btn" type="button">
                  View All
                </button>
              </div>

              <div className="dashboard-feature-grid">
                <button
                  className={selectedFeatured === featuredSpaces[0].title ? "dashboard-feature-large selected" : "dashboard-feature-large"}
                  type="button"
                  onClick={() => handleFeaturedClick(featuredSpaces[0].title)}
                >
                  <img src={featuredSpaces[0].image} alt={featuredSpaces[0].title} />
                  <div className="dashboard-feature-large-content">
                    <span className="dashboard-badge">{featuredSpaces[0].badge}</span>
                    <h3>{featuredSpaces[0].title}</h3>
                    <p>{featuredSpaces[0].description}</p>
                    <div className="dashboard-space-meta">
                      <div className="dashboard-avatar-stack">•••</div>
                      <span>{featuredSpaces[0].members}</span>
                    </div>
                  </div>
                </button>

                <div className="dashboard-card-small-stack">
                  <button
                    className={selectedFeatured === featuredSpaces[1].title ? "dashboard-card-small primary selected" : "dashboard-card-small primary"}
                    type="button"
                    onClick={() => handleFeaturedClick(featuredSpaces[1].title)}
                  >
                    <h4>{featuredSpaces[1].title}</h4>
                    <p>{featuredSpaces[1].detail}</p>
                    <div className="dashboard-space-meta">
                      <span className="dashboard-status-pill">{featuredSpaces[1].badge}</span>
                      <span>→</span>
                    </div>
                  </button>

                  <button
                    className={selectedFeatured === featuredSpaces[2].title ? "dashboard-card-small alt selected" : "dashboard-card-small alt"}
                    type="button"
                    onClick={() => handleFeaturedClick(featuredSpaces[2].title)}
                  >
                    <h4>{featuredSpaces[2].title}</h4>
                    <p>{featuredSpaces[2].detail}</p>
                    <div className="dashboard-space-meta">
                      <span>💬 {featuredSpaces[2].badge}</span>
                      <span>→</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="dashboard-inline-note">
                Featured preview: {activeFeaturedSpace.title} • {activeFeaturedSpace.description ?? activeFeaturedSpace.detail}
              </div>
            </section>

            <section className="dashboard-section-card" style={{ marginTop: 24 }}>
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Team Workspaces &amp; CoPs</h2>
                <div className="dashboard-topbar-actions">
                  {workspaceFilters.map((filter) => (
                    <button
                      key={filter}
                      className={filter === activeFilter ? "dashboard-filter-btn active" : "dashboard-filter-btn"}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dashboard-space-grid">
                {filteredWorkspaces.length > 0 ? (
                  filteredWorkspaces.map((space) => (
                    <article className="dashboard-space-card" key={space.title}>
                      <div className="dashboard-space-card-header">
                        <div className={`dashboard-space-icon ${space.type === "outline" ? "two" : "one"}`}>
                          {space.icon}
                        </div>
                        <span className="dashboard-status-pill">{space.status}</span>
                      </div>
                      <h4>{space.title}</h4>
                      <p>{space.description}</p>
                      <div className="dashboard-space-meta">
                        <div>👥 {space.members}</div>
                        <Button
                          className={space.type === "outline" ? "dashboard-action-btn light" : "dashboard-action-btn"}
                          type="button"
                          onClick={() => handleWorkspaceAction(space.title)}
                        >
                          {space.button}
                        </Button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="dashboard-empty-state">
                    No spaces match your current search and workspace filter.
                  </div>
                )}
              </div>
            </section>

            <section className="dashboard-innovation">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title" style={{ color: "#ffffff" }}>
                  Innovation Hub
                </h2>
              </div>
              <p>
                Have a new idea for improving our digital workplace or
                departmental efficiency? Pitch it here and let the community vote.
              </p>

              <div className="dashboard-innovation-grid">
                <div className="dashboard-innovation-card">
                  <div className="dashboard-space-meta">
                    <strong>Unified Data Dashboard</strong>
                    <span>+{votes["Unified Data Dashboard"]}</span>
                  </div>
                  <p>Proposed by: Sipho M. • 2 days ago</p>
                  <div className="dashboard-space-meta">
                    <button className="dashboard-link-btn" type="button" onClick={() => handleVote("Unified Data Dashboard")}>
                      Vote Up
                    </button>
                    <button className="dashboard-link-btn" type="button" onClick={() => setHelperMessage("Unified Data Dashboard pitch opened.")}>
                      Read Pitch
                    </button>
                  </div>
                </div>

                <div className="dashboard-innovation-card">
                  <div className="dashboard-space-meta">
                    <strong>Remote Work Hubs</strong>
                    <span>+{votes["Remote Work Hubs"]}</span>
                  </div>
                  <p>Proposed by: Lerato K. • 4 days ago</p>
                  <div className="dashboard-space-meta">
                    <button className="dashboard-link-btn" type="button" onClick={() => handleVote("Remote Work Hubs")}>
                      Vote Up
                    </button>
                    <button className="dashboard-link-btn" type="button" onClick={() => setHelperMessage("Remote Work Hubs pitch opened.")}>
                      Read Pitch
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="dashboard-side-column">
            <section className="dashboard-side-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Recent Activity</h2>
              </div>
              <div className="dashboard-activity-list">
                {visibleActivities.map((item) => {
                  const itemId = item.name + item.time;
                  const isExpanded = expandedActivity === itemId;

                  return (
                    <div
                      className={isExpanded ? "dashboard-activity-item expanded" : "dashboard-activity-item"}
                      key={itemId}
                      onClick={() => handleActivityToggle(itemId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleActivityToggle(itemId);
                        }
                      }}
                    >
                      {item.avatar ? (
                        <img className="dashboard-avatar" src={item.avatar} alt={item.name} />
                      ) : (
                        <div className="dashboard-avatar-plain">{item.avatarLabel}</div>
                      )}
                      <div className="dashboard-activity-copy">
                        <p>
                          <strong>{item.name}</strong> {item.text}
                        </p>
                        {isExpanded ? <p className="dashboard-activity-comment">{item.comment ?? "Open discussion thread ready."}</p> : null}
                        <div className="dashboard-space-meta">
                          <button
                            className="dashboard-feed-action"
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleActivityAction(itemId, "like");
                            }}
                          >
                            👍 {item.likes ?? ""}
                          </button>
                          <button
                            className="dashboard-feed-action"
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleActivityAction(itemId, "reply");
                            }}
                          >
                            💬 {item.replies ?? ""}
                          </button>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="dashboard-link-btn" type="button" style={{ marginTop: 16 }} onClick={handleLoadMore}>
                {visibleActivityCount < activityFeed.length ? "Load More Activity" : "All Activity Loaded"}
              </button>
            </section>

            <section className="dashboard-side-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Quick Resources</h2>
              </div>
              <div className="dashboard-resource-list">
                {resources.map((resource) => (
                  <button
                    className="dashboard-resource-item dashboard-resource-button"
                    key={resource.title}
                    type="button"
                    onClick={() => handleResourceClick(resource.title)}
                  >
                    <div className="dashboard-resource-icon">{resource.icon}</div>
                    <div>
                      <strong>{resource.title}</strong>
                      <div className="text-muted">{resource.meta}</div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedResource ? (
                <div className="dashboard-inline-note">Selected resource: {selectedResource}</div>
              ) : null}
            </section>

            <section className="dashboard-side-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Space Spotlight</h2>
              </div>
              <div className="dashboard-spotlight">
                <img
                  alt="Spotlight Member"
                  src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80"
                />
                <div>
                  <h4>Dr. Amara Okoro</h4>
                  <p>Senior Lead, PMO</p>
                  <span className="dashboard-status-pill">TOP CONTRIBUTOR</span>
                </div>
              </div>
              <p>
                “Amara has successfully facilitated over 15 cross-departmental workshops this quarter. Reach out to her for facilitation tips!”
              </p>
              <Button
                className="dashboard-action-btn light"
                type="button"
                style={{ width: "100%" }}
                onClick={() => setHelperMessage("Amara's contact card is ready to open.")}
              >
                Connect with Amara
              </Button>
            </section>
          </aside>
        </div>
      </Container>

      <button className="dashboard-floating-fab" type="button">
        ✎
      </button>
    </div>
  );
}

export default Dashboard;
