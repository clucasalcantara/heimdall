"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface IntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onDontShowAgain: () => void
}

export function IntegrationModal({ isOpen, onClose, onDontShowAgain }: IntegrationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-white">
        {/* Icon and close button */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <X className="w-6 h-6 text-black" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">This generation uses an integration</h2>
          <p className="text-gray-400 leading-relaxed">
            Complete the steps in chat to ensure the generation works correctly.
          </p>
        </div>

        {/* Don't show again button */}
        <Button
          onClick={onDontShowAgain}
          variant="outline"
          className="w-auto bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500"
        >
          Don't show again
        </Button>
      </div>
    </div>
  )
}
