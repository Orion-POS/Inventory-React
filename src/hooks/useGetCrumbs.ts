import { useMatches } from 'react-router-dom';

interface RouteHandle {
  crumb?: (data: unknown) => string;
}

const getCrumb = (handle: unknown) => (handle as RouteHandle | undefined)?.crumb;

const useGetCrumbs = (): string[] => {
  const matches = useMatches();

  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter(match => Boolean(getCrumb(match.handle)))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map(match => getCrumb(match.handle)!(match.data));

  return crumbs;
};

export default useGetCrumbs