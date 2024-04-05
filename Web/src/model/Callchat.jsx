class CallAPI {
   
    async genChat(Data) {
        try { 
            const IP=import.meta.env.VITE_IP;
            const response = await fetch('http://'+IP+':4000/Genplanning/Chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    TravelPlan: {
                        Destination: Data.Destination,
                        TravelPeriod: Data.TravelPeriod,
                        TravelType: Data.TravelType,
                        Budget: Data.Budget,
                        Travelers: Data.Travelers
                    }
                })
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Re-throw the error to handle it in the calling code
        }
    }
    async dumb() {
        try {
            const res = {
                "TripData": [
                    {
                        "PlaceArea": "Pattaya",
                        "DayNum": 1,
                        "DayDetail": "05/02/2024",
                        "PlaceProgram": [
                            {
                                "PlaceID": 1,
                                "PlaceName": "Pattaya Beach",
                                "PlaceDescript": "Enjoy the breathtaking beauty of Pattaya Beach, surrounded by crystal-clear waters and golden sands. A perfect place to unwind and witness the mesmerizing sunset.",
                                "LocationID": "13.0827,100.9200",
                                "Type": "Natural",
                                "Activity": "Stroll along the shore and appreciate the scenic views"
                            },
                            {
                                "PlaceID": 2,
                                "PlaceName": "Khao Phra Tamnak",
                                "PlaceDescript": "Visit Khao Phra Tamnak for panoramic views of Pattaya. This natural spot offers a peaceful atmosphere, ideal for a leisurely walk and enjoying the sunset.",
                                "LocationID": "13.0827,100.9200",
                                "Type": "Natural",
                                "Activity": "Explore the area and capture stunning photographs"
                            }
                        ]
                    },
                    {
                        "PlaceArea": "Pattaya",
                        "DayNum": 2,
                        "DayDetail": "06/02/2024",
                        "PlaceProgram": [
                            {
                                "PlaceID": 1,
                                "PlaceName": "Central Pattaya",
                                "PlaceDescript": "Discover Central Pattaya, a vibrant area with bustling markets and entertainment. Immerse yourself in the local culture and enjoy shopping and street food.",
                                "LocationID": "13.0827,100.9200",
                                "Type": "Urban",
                                "Activity": "Explore local markets and try authentic Thai cuisine"
                            },
                            {
                                "PlaceID": 2,
                                "PlaceName": "Ramayana",
                                "PlaceDescript": "Experience the thrill at Ramayana Water Park, featuring exhilarating water slides and attractions. A perfect place for family fun and adventure.",
                                "LocationID": "13.0827,100.9200",
                                "Type": "Entertainment",
                                "Activity": "Enjoy water activities and relax by the pools"
                            }
                        ]
                    }
                ]
            }
            return res;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

export default new CallAPI();