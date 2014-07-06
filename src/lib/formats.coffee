define [
  "formats/project"
  "formats/daw"
  "formats/als"
], (Project, Daw, Als)->

  formats =
    Project: Project
    Daw: Daw
    Als: Als
    
  return formats
