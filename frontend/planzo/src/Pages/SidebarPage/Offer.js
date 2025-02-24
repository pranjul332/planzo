import React from "react";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const OfferCard = ({ offer }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        <img
          src="/api/placeholder/400/200"
          alt={offer.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
          {offer.discount}% OFF
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{offer.destination}</h3>
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
          <MapPin className="w-4 h-4" />
          <span>{offer.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
          <Calendar className="w-4 h-4" />
          <span>{offer.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
          <Tag className="w-4 h-4" />
          <span className="line-through">${offer.originalPrice}</span>
          <span className="text-red-500 font-semibold">
            ${offer.discountedPrice}
          </span>
        </div>
        <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
          Book Now
        </button>
      </div>
    </div>
  );
};

const Offer = () => {
  const travelOffers = [
    {
      destination: "Bali Paradise",
      location: "Indonesia",
      duration: "7 Days",
      discount: 25,
      originalPrice: 1200,
      discountedPrice: 900,
    },
    {
      destination: "Swiss Alps",
      location: "Switzerland",
      duration: "5 Days",
      discount: 20,
      originalPrice: 1500,
      discountedPrice: 1200,
    },
    // Add more offers as needed
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Special Travel Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelOffers.map((offer, index) => (
            <OfferCard key={index} offer={offer} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Offer;
