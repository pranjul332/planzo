import React from "react";
import { Check, Bot, Calendar, Map } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const PremiumFeatures = () => {
  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Trip Planning",
      description: "Get personalized trip recommendations powered by AI",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "20 Trip Planning Slots",
      description: "Plan and organize up to 20 trips simultaneously",
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Advanced Maps",
      description: "Access detailed maps and routing features",
    },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upgrade to Premium</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Premium Features</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-purple-600">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>AI-powered trip planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Plan up to 20 trips</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Advanced mapping features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <button className="w-full mt-6 bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
