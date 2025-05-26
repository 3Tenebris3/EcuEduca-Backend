/* ---------- elementos enviados al front ---------- */
export interface QPItemDTO {
  id:      string;
  name?:   string;
  imgUrl:  string;
}

export interface QPThemeDTO {
  id:          string;
  bg:          string;
  targets:     QPItemDTO[];
  distractors: QPItemDTO[];
}

/* ---------- envío de score ---------- */
export interface QPSubmitDTO {
  setId:  string;
  hits:   number;
  misses: number;
}
