a =  {
    "name": "validate",     // kötelezően a JSON file neve
    "type": "validate_days",// az alkalmazáson belül megjelenített név
    "className": "blue",    // szín, és egyéb vizuális tulajdonságok
    "inputs": [],           // bemeneti property-k. értéke lehet false is
    "outputs": [],          // kimeneti property-k. értéke lehet false is
    "config": {             // a node tényleges állapottere
        "self": "algo",     // a szeralizálásban az objektum key-e, amiben
        "data": {           // a data mezőben szereplő értékek lesznek
            "class_name": { // egy adatmező key-e
                "type": "string" // az adatmező típusa.
            }
        }
    }
}