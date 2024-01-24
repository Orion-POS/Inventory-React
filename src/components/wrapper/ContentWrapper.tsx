import { css } from '@emotion/react';

const ContentWrapper = ({ children }) => {
  return (
    <div
      className="flex flex-col rounded-md px-3 py-4 min-h-[93%]  border-gray-200"
      css={css`
        border: 1px solid gray;
      `}>
      {children}
    </div>
  );
};

export default ContentWrapper