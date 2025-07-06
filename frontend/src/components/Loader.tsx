

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}>
          <div className="w-2 h-2 bg-blue-500 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 -left-1 transform -translate-y-1/2"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2"></div>
        </div>
        
        {/* Loading text */}
        <div className="mt-8 text-center">
          <p className="text-blue-500 font-medium text-lg">Please wait...</p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;