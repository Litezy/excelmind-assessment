import React, { useEffect, useRef } from 'react';

//modal layout types
export interface ModalLayoutProps {
    children: React.ReactNode;
    setModal: (value: boolean) => void;
    modalclass?: string;
}


const ModalLayout: React.FC<ModalLayoutProps> = ({ children, setModal, modalclass }) => {
    const refdiv = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (refdiv.current && !refdiv.current.contains(e.target as Node)) {
                setModal(false);
            }
        };

        window.addEventListener('click', handleClickOutside, true);

        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };
    }, [setModal]);

    return (
        <div className="w-full z-50 h-screen fixed bg-black/30 flex top-0 left-0 items-center justify-center  backdrop-blur-sm">
            <div ref={refdiv} className={`${modalclass} max-h-[100dvh] overflow-y-auto`}>
                {children}
            </div>
        </div>
    );
};

export default ModalLayout;