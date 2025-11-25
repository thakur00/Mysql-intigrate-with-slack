import React from 'react';
import { ArrowRight, Lock, Server, Shield, Database, Globe } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Secure Architecture Overview</h2>
        
        {/* Visual Flow */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative">
                
                {/* Step 1: Slack */}
                <div className="flex flex-col items-center z-10 w-40 text-center">
                    <div className="w-16 h-16 bg-[#4A154B] rounded-2xl flex items-center justify-center shadow-lg mb-3">
                        <span className="text-white font-bold text-xl">Slack</span>
                    </div>
                    <h3 className="font-bold text-gray-800">User Interface</h3>
                    <p className="text-xs text-gray-500 mt-1">/sql command</p>
                </div>

                {/* Arrow */}
                <div className="flex-1 flex items-center justify-center relative px-2">
                   <div className="h-0.5 bg-gray-300 w-full absolute"></div>
                   <div className="bg-white px-2 z-10 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-gray-500 mb-1">HTTPS (POST)</span>
                      <ArrowRight className="text-gray-400" />
                   </div>
                </div>

                {/* Step 2: Gateway/API */}
                <div className="flex flex-col items-center z-10 w-40 text-center">
                     <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-blue-100">
                        <Globe className="text-white" />
                     </div>
                     <h3 className="font-bold text-gray-800">Middleware</h3>
                     <p className="text-xs text-gray-500 mt-1">API Gateway / Node App</p>
                     <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full mt-1 border border-yellow-200">Signature Verify</span>
                </div>

                 {/* Arrow */}
                 <div className="flex-1 flex items-center justify-center relative px-2">
                   <div className="h-0.5 bg-gray-300 w-full absolute"></div>
                   <div className="bg-white px-2 z-10 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-gray-500 mb-1">VPC / Tunnel</span>
                      <Lock size={16} className="text-green-600" />
                   </div>
                </div>

                {/* Step 3: Database */}
                <div className="flex flex-col items-center z-10 w-40 text-center">
                     <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg mb-3">
                        <Database className="text-white" />
                     </div>
                     <h3 className="font-bold text-gray-800">AWS EC2</h3>
                     <p className="text-xs text-gray-500 mt-1">MySQL Database</p>
                     <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full mt-1 border border-gray-200">Port 3306</span>
                </div>

            </div>
        </div>

        {/* Security Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                    <Shield className="text-indigo-600 mr-2" size={20} />
                    <h3 className="font-bold text-gray-800">Slack Request Validation</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    The middleware authenticates every request from Slack by verifying the <code>X-Slack-Signature</code> header using your app's Signing Secret. This ensures only Slack can trigger queries.
                </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                    <Lock className="text-green-600 mr-2" size={20} />
                    <h3 className="font-bold text-gray-800">Network Security</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    The MySQL instance is inside a private VPC subnet. The middleware connects via VPC Peering or a secure SSH Tunnel. Port 3306 is <strong>never</strong> exposed to the public internet.
                </p>
            </div>

             <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                    <Server className="text-blue-600 mr-2" size={20} />
                    <h3 className="font-bold text-gray-800">Least Privilege Access</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    The application connects to MySQL using a dedicated read-only user (e.g., <code>slack_ro</code>) with limited permissions to prevent accidental data modification or dropping tables.
                </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                    <Globe className="text-purple-600 mr-2" size={20} />
                    <h3 className="font-bold text-gray-800">Data Encryption</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    All data in transit is encrypted. HTTPS is used for the Slack-to-Middleware leg, and SSL/TLS is enforced for the Middleware-to-MySQL connection.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
