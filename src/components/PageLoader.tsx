import { Loader2 } from 'lucide-react';

const PageLoader = () => (
  <div
    role="status"
    className="flex h-full min-h-40 items-center justify-center text-muted-foreground"
  >
    <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
    <span className="sr-only">Loading</span>
  </div>
);

export default PageLoader;
