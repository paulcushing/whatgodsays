export type Gender = "male" | "female";

export type Settings = {
  personalize: boolean;
  name: string;
  gender: Gender;
};

const KEYS = {
  personalize: "personalize",
  name: "name",
  gender: "gender",
} as const;

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadSettings(): Settings {
  if (!hasStorage()) {
    return { personalize: false, name: "", gender: "male" };
  }
  return {
    personalize: localStorage.getItem(KEYS.personalize) === "true",
    name: localStorage.getItem(KEYS.name) ?? "",
    gender: localStorage.getItem(KEYS.gender) === "female" ? "female" : "male",
  };
}

export function setPersonalize(value: boolean): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.personalize, value ? "true" : "false");
}

export function setName(name: string): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.name, name);
}

export function setGender(gender: Gender): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.gender, gender);
}
