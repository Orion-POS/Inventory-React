import BasicModal from '@/components/modals/Modal';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextType {
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;
}

interface OpenModalOptions {
  title?: string;
  description?: string;
  content: (cb: any) => string | JSX.Element;
  onSubmit?: () => void;
  modalOptions?: {
    renderCustomHeader?: ReactNode;
    renderCustomFooter?: ReactNode;
    disableClickOutside?: boolean;
    overideFooter?: React.ReactNode;
  };
}
const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<OpenModalOptions | null>(null);

  const openModal = (options: OpenModalOptions) => {
    const { title, description, content, onSubmit, modalOptions } = options;
    setShowModal(true);
    setModalContent({
      title,
      description,
      content,
      onSubmit,
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
      <BasicModal
        open={showModal}
        onClose={closeModal}
        title={modalContent?.title ?? ''}
        description={modalContent?.description}
        disableClickOutside={modalContent?.modalOptions?.disableClickOutside}
        overideFooter={modalContent?.modalOptions?.overideFooter}
        onSubmit={modalContent?.onSubmit}>
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
