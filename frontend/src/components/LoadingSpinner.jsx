export default function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-8 h-8"></div>
        <span className="text-blue-500">Uploading...</span>
      </div>
    );
  }
  