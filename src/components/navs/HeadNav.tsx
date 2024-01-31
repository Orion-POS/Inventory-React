import useGetCrumbs from '@/hooks/useGetCrumbs';

const HeadNav = () => {
  const crumbs = useGetCrumbs();
  // console.log(crumbs, '<< CEKMATCHES');

  return (
    <div className=" h-14 flex-shrink-0 flex items-center bg-white pl-12 md:pl-6 shadow-sm">
      {crumbs.map((label, idx) => (
        <span
          className={`capitalize ${
            idx !== crumbs.length - 1
              ? ' text-gray-400 pr-2'
              : 'font-bold text-black pl-2 border-l-2'
          }`}>
          {label}
        </span>
      ))}
    </div>
  );
};

export default HeadNav;
