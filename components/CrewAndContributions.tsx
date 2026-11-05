import {
  assertCrewAndContributionsData,
  SYNTHETIC_NOTICE,
  type CrewAndContributionsData
} from "../contracts/build-progress/contract.ts";

export interface CrewAndContributionsProps {
  data: CrewAndContributionsData;
}

export function CrewAndContributions({
  data
}: CrewAndContributionsProps) {
  // Enforce the public snapshot shape (data types, profile-link rules,
  // and the exact synthetic notice) before rendering any of the data.
  assertCrewAndContributionsData(data);

  const isSynthetic = data.dataKind === "synthetic";

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

      {/*
        Contribution rendering is intentionally omitted: it belongs to a
        later approved stage and is not implemented in this component.
      */}
    </section>
  );
}

export default CrewAndContributions;
export type { CrewAndContributionsData } from "../contracts/build-progress/contract.ts";
