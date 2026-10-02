import { useMatches } from 'react-router-dom';

interface RouteHandle {
  crumb?: (data: unknown) => string;
}

export interface Crumb {
  label: string;
  pathname: string;
}

const getCrumb = (handle: unknown) => (handle as RouteHandle | undefined)?.crumb;

const useGetCrumbs = (): Crumb[] =>
  useMatches()
    // routes without a crumb in their handle are not shown
    .filter(match => Boolean(getCrumb(match.handle)))
    .map(match => ({ label: getCrumb(match.handle)!(match.data), pathname: match.pathname }));

export default useGetCrumbs;
