const RESUME_PATH = `${import.meta.env.BASE_URL}Shivam Khatri - Resume.pdf`;
const RESUME_FILENAME = "Shivam Khatri - Resume.pdf";

export async function downloadResume(event) {
  event.preventDefault();

  try {
    const response = await fetch(RESUME_PATH);
    if (!response.ok) throw new Error("Resume download failed");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = RESUME_FILENAME;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(RESUME_PATH, "_blank", "noopener,noreferrer");
  }
}

export { RESUME_PATH, RESUME_FILENAME };
