import {
  assertCrewAndContributionsData,
  SYNTHETIC_NOTICE,
  type ContributionStatus,
  type CrewAndContributionsData,
  type PublicContributor
} from "../contracts/build-progress/contract.ts";

export interface CrewAndContributionsProps {
  data: CrewAndContributionsData;
}

const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  accepted: "Accepted",
  integrated: "Integrated",
};

export function CrewAndContributions({
  data
}: CrewAndContributionsProps) {
  // Enforce the public snapshot shape (data types, profile-link rules,
  // and the exact synthetic notice) before rendering any of the data.
  assertCrewAndContributionsData(data);

  const isSynthetic = data.dataKind === "synthetic";

  // Stable contributor lookup for contribution attribution. The validator
  // guarantees every contributorId resolves within this snapshot.
  const contributorById = new Map<string, PublicContributor>();
  for (const contributor of data.contributors) {
    contributorById.set(contributor.id, contributor);
  }

  return (
    <section aria-label="Crew and contributions">
      {isSynthetic ? (
        <p role="note" style={{ fontWeight: "bold" }}>
          {data.notice ?? SYNTHETIC_NOTICE}
        </p>
      ) : null}

      {data.contributors.length === 0 ? (
        <p>No public Crew Members yet</p>
      ) : (
        <ul>
          {data.contributors.map((contributor) => {
            const profileUrl =
              typeof contributor.profileUrl === "string" &&
              contributor.profileUrl.startsWith("https://")
                ? contributor.profileUrl
                : null;
            const agent = contributor.agent;

            return (
              <li key={contributor.id}>
                <p>
                  <strong>{contributor.displayName}</strong>{" "}
                  {profileUrl ? (
                    <a href={profileUrl} target="_blank" rel="noopener noreferrer
">
                      Profile
                    </a>
                  ) : null}
                </p>
                {agent ? <p>Agent: {agent.displayName}</p> : null}
              </li>
            );
          })}
        </ul>
      )}

      {data.contributions.length === 0 ? (
        <p>No accepted contributions published yet</p>
      ) : (
        <ul>
          {data.contributions.map((contribution) => {
            const contributor = contributorById.get(contribution.contributorId);
            const contributorAgent = contributor?.agent;
            // Agent attribution only when an agentId is explicitly supplied and
            // matches this contributor's published agent. Never inferred from
            // the mere presence of an agent profile.
            const agent =
              contributor !== undefined &&
              contribution.agentId !== undefined &&
              contributorAgent !== undefined &&
              contributorAgent.id === contribution.agentId
                ? contributorAgent
                : null;
            const evidenceUrl =
              typeof contribution.link === "string" &&
              contribution.link.startsWith("https://")
                ? contribution.link
                : null;

            return (
              <li key={contribution.id}>
                <p>
                  <strong style={{ overflowWrap: "anywhere" }}>{contribution.title}</strong>{" "}
                  <span>{CONTRIBUTION_STATUS_LABELS[contribution.status]}</span>
                </p>
                {contributor ? (
                  <p>
                    By <strong>{contributor.displayName}</strong>
                  </p>
                ) : null}
                {agent ? <p>Agent: {agent.displayName}</p> : null}
                {evidenceUrl ? (
                  <p>
                    <a href={evidenceUrl} target="_blank" rel="noopener noreferrer
">
                      Evidence
                    </a>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CrewAndContributions;
export type { CrewAndContributionsData } from "../contracts/build-progress/contract.ts";
