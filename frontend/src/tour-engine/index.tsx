
const tourDefinition = [
    {
        "url": "/",
        "selector": "#home-title",
        "title": "Welcome to Juicy Test Tour",
        "text": "This tour will guide you through the main features of the app. Click Next to begin.",
        "continueByTargetClick": false
    },
    {
        "url": "/",
        "selector": "#nav-items",
        "title": "View Your Items",
        "text": "Click the Items menu to navigate to your item collection.",
        "continueByTargetClick": true
    },
    {
        "url": "/items",
        "selector": ".item:nth-child(1)",
        "title": "Your First Item",
        "text": "This is the first item in your list.",
        "continueByTargetClick": false
    }
]

export function TourEngine() {
    return null;
}

