import BasicModal from '@/components/modals/Modal';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextType {
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;
}

interface OpenModalOptions {
  title?: string;
  content: (cb: any) => string | JSX.Element;
  modalOptions?: {
    renderCustomHeader?: ReactNode;
    renderCustomFooter?: ReactNode;
    disableClickOutside?: boolean;
    overideFooter?: React.ReactNode;
  };
}
const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<OpenModalOptions | null>(null);

  const openModal = (options: OpenModalOptions) => {
    console.log(options, '<< CHECK MODAL CONTENT');
    const { content, modalOptions, title } = options;

    setShowModal(true);
    setModalContent({
      title,
      content,
      modalOptions
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* {modalContent && (
        <div className="modal-overlay">
          <div className="modal">
            {modalContent.renderCustomHeader ? (
              <div className="modal-header">{modalContent.renderCustomHeader}</div>
            ) : (
              <div className="modal-header">{modalContent.title}</div>
            )}
            <div className="modal-content">{modalContent.content}</div>
            {modalContent.renderCustomFooter && (
              <div className="modal-footer">{modalContent.renderCustomFooter}</div>
            )}
          </div>
        </div>
      )} */}
      {/* {modalContent && (
      )} */}
      <BasicModal
        open={showModal}
        onClose={closeModal}
        title={modalContent?.title ?? ''}
        disableClickOutside={modalContent?.modalOptions?.disableClickOutside}
        overideFooter={modalContent?.modalOptions?.overideFooter}
        // onSubmit={modalContent?.modalOptions?.on}
      >
        {modalContent?.content(closeModal)}
      </BasicModal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
