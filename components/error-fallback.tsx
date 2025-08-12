import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"

interface ErrorFallbackProps {
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorFallback({ 
  message = "Hubo un problema al cargar el contenido", 
  onRetry, 
  showRetry = true 
}: ErrorFallbackProps) {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Card className="max-w-md mx-auto text-center border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Contenido no disponible
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar de nuevo
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorFallback
