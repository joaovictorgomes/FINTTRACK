"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface DeleteButtonProps {
  onDelete: () => void
  itemName?: string
}

export default function DeleteButton({ onDelete, itemName = "este item" }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const openModal = () => {
    previousFocusRef.current = document.activeElement as HTMLElement
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => {
      previousFocusRef.current?.focus()
    }, 0)
  }

  const handleConfirm = () => {
    onDelete()
    closeModal()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return

    // Fechar modal com ESC
    if (e.key === "Escape") {
      closeModal()
    }

    // Trap focus dentro do modal
    if (e.key === "Tab") {
      if (!modalRef.current?.contains(document.activeElement)) {
        e.preventDefault()
        cancelButtonRef.current?.focus()
        return
      }

      if (e.shiftKey) {
        if (document.activeElement === cancelButtonRef.current) {
          e.preventDefault()
          confirmButtonRef.current?.focus()
        }
      } else {
        if (document.activeElement === confirmButtonRef.current) {
          e.preventDefault()
          cancelButtonRef.current?.focus()
        }
      }
    }
  }

  // Gerenciar eventos de teclado
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Focar no botão cancelar quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelButtonRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Prevenir scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={openModal}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Excluir"
      >
        Excluir
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 animate-fadeIn"
          aria-hidden="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          {/* Modal */}
          <div
            ref={modalRef}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto animate-scaleIn"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                Confirmar exclusão
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Tem certeza que deseja excluir {itemName}? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
              <button
                ref={cancelButtonRef}
                onClick={closeModal}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                ref={confirmButtonRef}
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 rounded-md text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
