import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function Alert({ children, variant = "info", onClose, className = "" }) {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-400",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: AlertCircle,
      iconColor: "text-red-400",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: Info,
      iconColor: "text-blue-400",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: AlertCircle,
      iconColor: "text-yellow-400",
    },
  };

  const { container, icon: Icon, iconColor } = variants[variant];

  return (
    <div className={`border rounded-md p-4 ${container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconColor} hover:bg-opacity-20`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
