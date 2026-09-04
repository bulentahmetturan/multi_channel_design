interface Props {
  kind: 'content' | 'design' | 'review' | 'publish';
  value: string;
  label: string;
}

// Maps a status enum value to a restrained pill style. Purely presentational
// -- takes an already-resolved label, never formats/derives strings itself.
export function StatusPill({ value, label }: Props) {
  const cls = pillClass(value);
  return <span className={`pill ${cls}`}>{label}</span>;
}

function pillClass(value: string): string {
  switch (value) {
    case 'CONTENT_READY':
    case 'DESIGN_READY':
    case 'APPROVED':
    case 'READY_FOR_REVIEW':
      return 'pill-ready';
    case 'DRAFT':
    case 'GENERATING':
      return 'pill-draft';
    case 'REVISION_REQUESTED':
    case 'REVISION_REQUIRED':
      return 'pill-revision';
    case 'BLOCKED':
    case 'REJECTED':
      return 'pill-blocked';
    default:
      return 'pill-not-ready';
  }
}
