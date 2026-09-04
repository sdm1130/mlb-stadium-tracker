// MLB Stadium Tracker — 2026 season data for all 30 current MLB ballparks.
// Image URLs use the stable Wikipedia "Special:FilePath" redirect, which always
// resolves to the current file on Wikimedia Commons (no hash-path guessing).
const STADIUMS = [
  { id: "yankee-stadium", team: "New York Yankees", stadiumName: "Yankee Stadium", city: "Bronx", state: "NY", lat: 40.8296, lng: -73.9262, opened: 2009, capacity: 46537, roofType: "Open Air", league: "AL", division: "AL East", funFacts: [
    "Monument Park beyond center field has plaques and monuments honoring Yankee legends like Babe Ruth, Lou Gehrig, and Mickey Mantle — players actually visit it before games.",
    "The right field wall is only 314 feet from home plate, the shortest porch in the majors, which has helped lefty sluggers crush home runs for over a century.",
    "A giant replica of the original 1923 stadium's scalloped roof frieze runs along the top of the entire ballpark.",
    "The Great Hall entrance is lined with enormous banners of Yankee greats, and monuments in the park include one for Pope John Paul II, who held Mass there in 1979."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Yankee_Stadium_Panorama.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Yankee_Stadium_aerial_from_Blackhawk.jpg"
  ], mapColor: "#132448", logoUrl: "assets/logos/yankee-stadium.svg" },

  { id: "fenway-park", team: "Boston Red Sox", stadiumName: "Fenway Park", city: "Boston", state: "MA", lat: 42.3467, lng: -71.0972, opened: 1912, capacity: 37755, roofType: "Open Air", league: "AL", division: "AL East", funFacts: [
    "Fenway is the oldest ballpark in Major League Baseball, opening the same week the Titanic sank in 1912.",
    "The Green Monster, a 37-foot-tall wall in left field, has a scoreboard that is still updated by hand from inside the wall.",
    "A single red seat out in the right-field bleachers marks the spot where Ted Williams hit the longest home run ever measured at Fenway — 502 feet.",
    "Pesky's Pole down the right-field line is named after infielder Johnny Pesky and is one of the closest foul poles to home plate in baseball."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Fenway_Park.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Fenway_Park_exterior_2001.jpg"
  ], mapColor: "#BD3039", logoUrl: "assets/logos/fenway-park.svg" },

  { id: "rogers-centre", team: "Toronto Blue Jays", stadiumName: "Rogers Centre", city: "Toronto", state: "ON", lat: 43.6414, lng: -79.3894, opened: 1989, capacity: 41500, roofType: "Retractable Roof", league: "AL", division: "AL East", funFacts: [
    "Rogers Centre was the first stadium in the world built with a fully retractable roof, which can open or close in about 20 minutes.",
    "It sits right next to the CN Tower, once the tallest freestanding structure on Earth, which looms over the outfield.",
    "It's the only MLB ballpark located outside the United States, making the Blue Jays the lone Canadian team in the league.",
    "A hotel built into the stadium once had rooms overlooking center field where guests could literally watch the game from their window."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Rogers_Centre,_Toronto,_Ontario_(21217570604).jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Rogers_Centre_Interior.JPG"
  ], mapColor: "#134A8E", logoUrl: "assets/logos/rogers-centre.svg" },

  { id: "camden-yards", team: "Baltimore Orioles", stadiumName: "Oriole Park at Camden Yards", city: "Baltimore", state: "MD", lat: 39.2838, lng: -76.6218, opened: 1992, capacity: 45971, roofType: "Open Air", league: "AL", division: "AL East", funFacts: [
    "Camden Yards started the modern trend of brick, old-fashioned 'retro' ballparks that nearly every new stadium since has copied.",
    "The B&O Warehouse looming beyond right field is the longest building on the East Coast at over 1,000 feet — only a handful of players have ever hit it on the fly.",
    "Eutaw Street, the walkway behind right field, has bronze baseballs embedded in the pavement marking exactly where warehouse home run balls have landed.",
    "The site was once a rail yard, and the ballpark still has real train tracks and a caboose on display nearby."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Camden_Yards.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Oriole_Park_at_Camden_Yards_(15550385753).jpg"
  ], mapColor: "#DF4601", logoUrl: "assets/logos/camden-yards.svg" },

  { id: "tropicana-field", team: "Tampa Bay Rays", stadiumName: "Tropicana Field", city: "St. Petersburg", state: "FL", lat: 27.7683, lng: -82.6534, opened: 1990, capacity: 25000, roofType: "Fixed Dome", league: "AL", division: "AL East", funFacts: [
    "Tropicana Field is the only fixed-roof dome stadium left in Major League Baseball.",
    "Catwalks and rings hang from the domed ceiling and are actually in play — a batted ball can hit certain rings and still count as a home run!",
    "In October 2024, Hurricane Milton tore huge panels off the dome's roof, forcing the Rays to play their entire 2025 season at the Yankees' spring training park in Tampa while crews spent about $60 million repairing it.",
    "The Rays returned home to a freshly repaired Tropicana Field for the 2026 season, complete with a new roof, new turf, and upgraded scoreboards."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Tropicana_field_from_air.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Tropicana_Field_big_screen.JPG"
  ], mapColor: "#092C5C", logoUrl: "assets/logos/tropicana-field.svg" },

  { id: "rate-field", team: "Chicago White Sox", stadiumName: "Rate Field", city: "Chicago", state: "IL", lat: 41.8299, lng: -87.6338, opened: 1991, capacity: 40615, roofType: "Open Air", league: "AL", division: "AL Central", funFacts: [
    "This ballpark has changed names five times: Comiskey Park II, U.S. Cellular Field, Guaranteed Rate Field, and now simply Rate Field since December 2024.",
    "An exploding scoreboard shoots fireworks and pinwheels spinning every time the White Sox hit a home run, a tradition carried over from the original Comiskey Park.",
    "When it opened in 1991, its upper deck had one of the steepest pitches of any stadium in baseball, giving fans a dramatic bird's-eye view.",
    "A plaque out in the parking lot marks the exact location of home plate from the original 1910 Comiskey Park, which stood right across the street."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:US_Cellular_Field.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:U.S._Cellular_Field_(Comiskey_Park),_Chicago,_Illinois_(9181784302).jpg"
  ], mapColor: "#27251F", logoUrl: "assets/logos/rate-field.svg" },

  { id: "progressive-field", team: "Cleveland Guardians", stadiumName: "Progressive Field", city: "Cleveland", state: "OH", lat: 41.4962, lng: -81.6852, opened: 1994, capacity: 34830, roofType: "Open Air", league: "AL", division: "AL Central", funFacts: [
    "Heritage Park beyond center field has statues and plaques honoring the greatest players in Cleveland baseball history.",
    "The left-field foul pole is nicknamed the 'Little Bandbox' area because the wall juts in sharply, making it one of the more unusual outfield shapes in baseball.",
    "The ballpark's massive scoreboard was, for years, one of the largest in the major leagues.",
    "The stadium was originally named Jacobs Field, nicknamed 'The Jake,' before later being renamed Progressive Field."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Progressive_Field.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Progressive_Field_aerial_2015.jpg"
  ], mapColor: "#00385D", logoUrl: "assets/logos/progressive-field.svg" },

  { id: "comerica-park", team: "Detroit Tigers", stadiumName: "Comerica Park", city: "Detroit", state: "MI", lat: 42.339, lng: -83.0485, opened: 2000, capacity: 41083, roofType: "Open Air", league: "AL", division: "AL Central", funFacts: [
    "Giant tiger statues with glowing eyes flank the main entrance, and more tiger sculptures are scattered throughout the ballpark.",
    "Comerica Park has its own carousel and Ferris wheel inside the stadium, with baseball-shaped cars on the wheel.",
    "A large fountain beyond center field shoots water into the air whenever the Tigers hit a home run or win a game.",
    "The scoreboard is topped with tiger head sculptures that roar and light up with fireworks after big plays."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Comerica_Park.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Comerica_Park,_Home_of_the_Detroit_Tigers_Baseball_Team.jpg"
  ], mapColor: "#0C2340", logoUrl: "assets/logos/comerica-park.svg" },

  { id: "kauffman-stadium", team: "Kansas City Royals", stadiumName: "Kauffman Stadium", city: "Kansas City", state: "MO", lat: 39.0517, lng: -94.4803, opened: 1973, capacity: 37903, roofType: "Open Air", league: "AL", division: "AL Central", funFacts: [
    "Beyond the outfield wall is one of the largest scoreboards and water fountain displays in professional sports, spraying nearly 10 feet high.",
    "The stadium's crown-shaped scoreboard is a nod to the Royals' name and Kansas City's nickname as the 'City of Fountains.'",
    "It's one of the last true multi-purpose 'cookie cutter' era stadiums still standing, having opened in 1973 as Royals Stadium.",
    "Kansas City is building a brand-new downtown ballpark for the Royals, but the team isn't expected to move in until around 2030 — so Kauffman remains home for now."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Kauffman_Stadium._Interleague.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Kauffman_Stadium,_Fountain_seats.JPG"
  ], mapColor: "#004687", logoUrl: "assets/logos/kauffman-stadium.svg" },

  { id: "target-field", team: "Minnesota Twins", stadiumName: "Target Field", city: "Minneapolis", state: "MN", lat: 44.9817, lng: -93.2776, opened: 2010, capacity: 38544, roofType: "Open Air", league: "AL", division: "AL Central", funFacts: [
    "Target Field is built from local Minnesota limestone and granite, giving it a distinct look among modern ballparks.",
    "A giant sign shaped like the Twins' 'Minnie and Paul' logo lights up and shakes hands every time the Twins hit a home run.",
    "The stadium sits right next to a light-rail station, so fans can hop off the train practically at the front gate.",
    "A statue of Hall of Famer Kirby Puckett greets fans near one of the main entrances."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Target_Field_Aerial.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Target_Field_2016.jpg"
  ], mapColor: "#002B5C", logoUrl: "assets/logos/target-field.svg" },

  { id: "daikin-park", team: "Houston Astros", stadiumName: "Daikin Park", city: "Houston", state: "TX", lat: 29.7573, lng: -95.3555, opened: 2000, capacity: 41168, roofType: "Retractable Roof", league: "AL", division: "AL West", funFacts: [
    "The ballpark was renamed Daikin Park in 2025 after playing for over two decades as Minute Maid Park — the naming deal runs all the way through 2039.",
    "A full-size replica 1860s locomotive runs on tracks above left field and toots its whistle whenever the Astros score a run or win a game.",
    "The retractable roof keeps games comfortable in Houston's steamy heat while still letting the team play on real grass.",
    "For years the field had a hill in deep center field called Tal's Hill, complete with a flagpole batters had to dodge — it was removed in 2016 to make room for more seats."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Minute_Maid_Park_2010.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Minute_Maid_Park_-_Crawford_Street_at_Texas_Avenue.JPG"
  ], mapColor: "#002D62", logoUrl: "assets/logos/daikin-park.svg" },

  { id: "angel-stadium", team: "Los Angeles Angels", stadiumName: "Angel Stadium", city: "Anaheim", state: "CA", lat: 33.8003, lng: -117.8827, opened: 1966, capacity: 45050, roofType: "Open Air", league: "AL", division: "AL West", funFacts: [
    "Beyond left field sits the 'California Spectacular,' a rock-and-geyser display that erupts with water and fireworks after every Angels home run and win.",
    "The giant 230-foot-tall 'Big A' sign with a halo on top used to stand inside the stadium before being moved to the parking lot.",
    "Angel Stadium is one of the oldest ballparks still in use in Major League Baseball, opening back in 1966.",
    "The outfield rock formation is planted with real trees and shrubs, making it feel like a mini mountain landscape inside the ballpark."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Angel_Stadium_of_Anaheim.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Angel_stadium_concrete_baseball.jpg"
  ], mapColor: "#BA0021", logoUrl: "assets/logos/angel-stadium.svg" },

  { id: "sutter-health-park", team: "Athletics", stadiumName: "Sutter Health Park", city: "West Sacramento", state: "CA", lat: 38.5805, lng: -121.5133, opened: 2000, capacity: 14014, roofType: "Open Air", league: "AL", division: "AL West", funFacts: [
    "This is officially the smallest ballpark in the majors, seating only around 14,000 fans — smaller than many minor league parks!",
    "The Athletics are a team in transition: after leaving Oakland, they're playing home games here in West Sacramento while a brand-new ballpark is built for them in Las Vegas, expected to open around 2028.",
    "The A's share this stadium with the minor-league Sacramento River Cats, who normally call it home the rest of the time.",
    "Every season the A's also play a special short homestand at Las Vegas Ballpark in Nevada, a preview of their eventual new home city."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Aerial_view_of_Sutter_Health_Park_in_2024.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Outside_Sutter_Health_Park.jpg"
  ], mapColor: "#003831", logoUrl: "assets/logos/sutter-health-park.svg" },

  { id: "t-mobile-park", team: "Seattle Mariners", stadiumName: "T-Mobile Park", city: "Seattle", state: "WA", lat: 47.5914, lng: -122.3325, opened: 1999, capacity: 47929, roofType: "Retractable Roof", league: "AL", division: "AL West", funFacts: [
    "The retractable roof doesn't fully seal the stadium — it acts more like a giant umbrella, sliding over the field to keep rain out while the sides stay open to the air.",
    "It opened in 1999 as Safeco Field before being renamed T-Mobile Park in 2019.",
    "On a clear day you can see both the downtown Seattle skyline and Mount Rainier from inside the ballpark.",
    "The center-field area, nicknamed 'The Pen,' lets fans get an up-close view right next to the bullpens."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Safeco_Field,_Seattle-.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Safeco_Field_night.jpg"
  ], mapColor: "#0C2C56", logoUrl: "assets/logos/t-mobile-park.svg" },

  { id: "globe-life-field", team: "Texas Rangers", stadiumName: "Globe Life Field", city: "Arlington", state: "TX", lat: 32.7473, lng: -97.0817, opened: 2020, capacity: 40300, roofType: "Retractable Roof", league: "AL", division: "AL West", funFacts: [
    "Globe Life Field has a fully climate-controlled retractable roof, keeping fans cool even during blazing Texas summers.",
    "It replaced the open-air Globe Life Park, which sits just across the street and is now used for other events.",
    "This ballpark hosted the entire 2020 World Series at a nearly empty stadium during the pandemic, with the Dodgers winning the title there.",
    "The batter's eye and outfield walls have unusual angles, giving the field a unique, asymmetrical shape."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Arlington_June_2020_5_(Globe_Life_Field).jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:20210523_globe_life_field_interior.jpg"
  ], mapColor: "#C0111F", logoUrl: "assets/logos/globe-life-field.svg" },

  { id: "truist-park", team: "Atlanta Braves", stadiumName: "Truist Park", city: "Cumberland", state: "GA", lat: 33.8908, lng: -84.4678, opened: 2017, capacity: 41084, roofType: "Open Air", league: "NL", division: "NL East", funFacts: [
    "Truist Park is surrounded by 'The Battery Atlanta,' a whole mini-neighborhood of restaurants, shops, and a hotel built right next to the ballpark.",
    "A giant tomahawk-shaped video board towers over left field.",
    "The Chop House restaurant sits inside the outfield wall, letting diners watch the game while they eat.",
    "It opened in 2017 as SunTrust Park before being renamed Truist Park in 2020."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:SunTrust_Park_Opening_Day_2017.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Truist_Park_2025.jpg"
  ], mapColor: "#13274F", logoUrl: "assets/logos/truist-park.svg" },

  { id: "loandepot-park", team: "Miami Marlins", stadiumName: "loanDepot park", city: "Miami", state: "FL", lat: 25.7781, lng: -80.2197, opened: 2012, capacity: 36742, roofType: "Retractable Roof", league: "NL", division: "NL East", funFacts: [
    "A wild, colorful home run sculpture used to spin, light up, and shoot water whenever the Marlins hit a homer — it became one of baseball's most talked-about (and debated) features.",
    "The retractable roof keeps the brutal Miami heat, humidity, and sudden thunderstorms from ruining games.",
    "The ballpark originally had huge saltwater fish tanks built right into the wall behind home plate.",
    "It opened in 2012 as Marlins Park before being renamed loanDepot park in 2021."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:LoanDepot_Park.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:LoanDepot_Park_2024.jpg"
  ], mapColor: "#00A3E0", logoUrl: "assets/logos/loandepot-park.svg" },

  { id: "citi-field", team: "New York Mets", stadiumName: "Citi Field", city: "Queens", state: "NY", lat: 40.7571, lng: -73.8458, opened: 2009, capacity: 41922, roofType: "Open Air", league: "NL", division: "NL East", funFacts: [
    "A giant apple rises out of a black top hat behind the outfield wall every time the Mets hit a home run — a tribute to the old Shea Stadium Home Run Apple.",
    "The main entrance, the Jackie Robinson Rotunda, honors the legendary player who broke baseball's color barrier, even though he never played for the Mets.",
    "The original, retired Home Run Apple from Shea Stadium still sits on display outside the park.",
    "Citi Field's brick facade was designed to echo Ebbets Field, the historic former home of the Brooklyn Dodgers."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Citi_Field.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Citi_Field_Night_Game.jpg"
  ], mapColor: "#002D72", logoUrl: "assets/logos/citi-field.svg" },

  { id: "citizens-bank-park", team: "Philadelphia Phillies", stadiumName: "Citizens Bank Park", city: "Philadelphia", state: "PA", lat: 39.9057, lng: -75.1665, opened: 2004, capacity: 42901, roofType: "Open Air", league: "NL", division: "NL East", funFacts: [
    "A giant replica Liberty Bell lights up and swings whenever the Phillies hit a home run.",
    "Ashburn Alley, a food court behind center field, is famous for Philly cheesesteaks and other local favorites.",
    "Statues of Phillies legends like Mike Schmidt and Steve Carlton stand outside the main gates.",
    "The bullpens are located in full view of fans down the outfield lines instead of being hidden away."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Citizens_Bank_Park_2021.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Citizens_Bank_Park.jpg"
  ], mapColor: "#E81828", logoUrl: "assets/logos/citizens-bank-park.svg" },

  { id: "nationals-park", team: "Washington Nationals", stadiumName: "Nationals Park", city: "Washington", state: "DC", lat: 38.873, lng: -77.0074, opened: 2008, capacity: 41339, roofType: "Open Air", league: "NL", division: "NL East", funFacts: [
    "Every game features the famous 'Presidents Race,' where mascots of George Washington, Thomas Jefferson, Abraham Lincoln, and Teddy Roosevelt sprint around the warning track.",
    "Nationals Park was the first LEED-certified 'green' major professional sports stadium in the country.",
    "From certain seats you can catch a glimpse of the U.S. Capitol dome in the distance beyond the outfield.",
    "The ballpark sits right along the Anacostia River, with a riverwalk connecting fans to the waterfront."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Nationals_Park_Panorama_2011.05.02_-_Washington_Nationals_v_San_Francisco_Giants.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Nationals_Park_-_left_field_gate.jpg"
  ], mapColor: "#AB0003", logoUrl: "assets/logos/nationals-park.svg" },

  { id: "wrigley-field", team: "Chicago Cubs", stadiumName: "Wrigley Field", city: "Chicago", state: "IL", lat: 41.9484, lng: -87.6553, opened: 1914, capacity: 41649, roofType: "Open Air", league: "NL", division: "NL Central", funFacts: [
    "The outfield walls are covered in real ivy that was hand-planted back in 1937 — a ball that gets lost in the vines is ruled a ground-rule double.",
    "Wrigley is the second-oldest ballpark in the majors and still has a hand-turned scoreboard that's been operated manually since 1937.",
    "Fans watch games for free from rooftop bleachers on apartment buildings across the street on Waveland and Sheffield Avenues.",
    "The iconic red marquee sign out front, reading 'WRIGLEY FIELD, HOME OF CHICAGO CUBS,' has greeted fans since 1934."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Wrigley_Field_Marquee_as_of_mid-2015.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Wrigley_Field_2016_World_Series_Game_4_-_Chicago_Cubs_vs_Cleveland_Indians.jpg"
  ], mapColor: "#0E3386", logoUrl: "assets/logos/wrigley-field.svg" },

  { id: "great-american-ball-park", team: "Cincinnati Reds", stadiumName: "Great American Ball Park", city: "Cincinnati", state: "OH", lat: 39.0979, lng: -84.5066, opened: 2003, capacity: 42319, roofType: "Open Air", league: "NL", division: "NL Central", funFacts: [
    "Two giant smokestacks beyond center field shoot real flames and fireworks after every Reds home run, a nod to the steamboats that once cruised the Ohio River.",
    "The ballpark sits right on the Ohio River, with riverboat-style architecture and great views of the water and the Roebling Suspension Bridge.",
    "Crosley Terrace, just outside the park, has bronze statues of Reds legends frozen mid-play, including Ted Kluszewski and Joe Nuxhall.",
    "The Cincinnati Reds were the first professional baseball team ever, founded all the way back in 1869."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Great_American_Ballpark_2007.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:2015_MLB_All_Star_Game_Great_American_Ball_Park_panorama_2015-07-14.jpg"
  ], mapColor: "#C6011F", logoUrl: "assets/logos/great-american-ball-park.svg" },

  { id: "american-family-field", team: "Milwaukee Brewers", stadiumName: "American Family Field", city: "Milwaukee", state: "WI", lat: 43.028, lng: -87.9712, opened: 2001, capacity: 41900, roofType: "Retractable Roof", league: "NL", division: "NL Central", funFacts: [
    "It has the only fan-shaped retractable roof in baseball, made of seven huge panels that fold open like a hand fan.",
    "Mascot Bernie Brewer slides down into a giant beer barrel chalet in left field every time the Brewers hit a home run.",
    "During the sixth inning, fans cheer on costumed sausages — Bratwurst, Italian, Polish, Hot Dog, and Chorizo — as they race around the warning track.",
    "The ballpark opened in 2001 as Miller Park before being renamed American Family Field in 2021."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Miller_Park0001.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Miller_Park_02.jpg"
  ], mapColor: "#12284B", logoUrl: "assets/logos/american-family-field.svg" },

  { id: "pnc-park", team: "Pittsburgh Pirates", stadiumName: "PNC Park", city: "Pittsburgh", state: "PA", lat: 40.4469, lng: -80.0057, opened: 2001, capacity: 38747, roofType: "Open Air", league: "NL", division: "NL Central", funFacts: [
    "PNC Park offers one of the most stunning views in sports, with the Pittsburgh skyline and three rivers visible right behind the outfield.",
    "The bright yellow Roberto Clemente Bridge closes to car traffic on game days so fans can walk straight across the river to the ballpark.",
    "It's one of the smallest capacity ballparks in the majors, which many fans say makes it feel extra cozy and easy to see the action from any seat.",
    "A statue of Hall of Famer Roberto Clemente stands near the entrance, honoring the beloved Pirates right fielder."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:PNC_Park.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:PNC_Park_Pittsburgh_front_entrance_gate.jpg"
  ], mapColor: "#FDB827", logoUrl: "assets/logos/pnc-park.svg" },

  { id: "busch-stadium", team: "St. Louis Cardinals", stadiumName: "Busch Stadium", city: "St. Louis", state: "MO", lat: 38.6226, lng: -90.1928, opened: 2006, capacity: 45494, roofType: "Open Air", league: "NL", division: "NL Central", funFacts: [
    "The view beyond the outfield includes the Gateway Arch, the tallest monument in the United States, towering over downtown St. Louis.",
    "This is the third stadium in St. Louis called Busch Stadium, continuing a tradition that dates back to 1953.",
    "Ballpark Village, a full entertainment district with restaurants and bars, was built right next to the stadium.",
    "Statues of Cardinals legends like Stan Musial and Bob Gibson line the walkways outside the park."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Busch_Stadium_from_top_of_the_Gateway_Arch.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Busch_Stadium_III_(16180972535).jpg"
  ], mapColor: "#C41E3A", logoUrl: "assets/logos/busch-stadium.svg" },

  { id: "chase-field", team: "Arizona Diamondbacks", stadiumName: "Chase Field", city: "Phoenix", state: "AZ", lat: 33.4455, lng: -112.0667, opened: 1998, capacity: 48405, roofType: "Retractable Roof", league: "NL", division: "NL West", funFacts: [
    "Because Phoenix summers are brutally hot, Chase Field's retractable roof is often closed with the air conditioning on, even on sunny days.",
    "There's an actual swimming pool built into the stands in right-center field that fans can rent out to watch the game.",
    "Chase Field has a real dirt path running from home plate to the pitcher's mound, a rare feature most modern parks don't have.",
    "The Diamondbacks won the World Series here in just their fourth season, in 2001."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Chase_Field_aerial.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Chase_Field,_July_3,_2021.jpg"
  ], mapColor: "#A71930", logoUrl: "assets/logos/chase-field.svg" },

  { id: "coors-field", team: "Colorado Rockies", stadiumName: "Coors Field", city: "Denver", state: "CO", lat: 39.7559, lng: -104.9942, opened: 1995, capacity: 46897, roofType: "Open Air", league: "NL", division: "NL West", funFacts: [
    "A row of purple seats in the upper deck marks the exact spot that's one mile above sea level — 5,280 feet up.",
    "Denver's thin mountain air lets baseballs fly much farther than at sea level, so the Rockies store all their game balls in a special humidor to help keep them from flying too far.",
    "The Rockpile, a section of cheap seats way out in center field, is famous for having some of the most passionate (and rowdiest) fans in the ballpark.",
    "You can often see the Rocky Mountains in the distance beyond the outfield on a clear day."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Coors_Field.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Coors_field_aerial_1.JPG"
  ], mapColor: "#33006F", logoUrl: "assets/logos/coors-field.svg" },

  { id: "dodger-stadium", team: "Los Angeles Dodgers", stadiumName: "Dodger Stadium", city: "Los Angeles", state: "CA", lat: 34.0739, lng: -118.24, opened: 1962, capacity: 56000, roofType: "Open Air", league: "NL", division: "NL West", funFacts: [
    "Dodger Stadium is the third-oldest ballpark in the majors and the largest by seating capacity of any current MLB stadium.",
    "It's famous for Dodger Dogs, one of the most beloved ballpark hot dogs in the country, with millions sold every season.",
    "The stadium sits in a natural bowl called Chavez Ravine, with sweeping views of downtown Los Angeles and the San Gabriel Mountains.",
    "Its nearly symmetrical outfield walls were an unusual design choice that has barely changed since it opened in 1962."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Dodger_Stadium_from_Top_Deck_evening_2021-06-28.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Dodger_Stadium_Opening_Day_2009.jpg"
  ], mapColor: "#005A9C", logoUrl: "assets/logos/dodger-stadium.svg" },

  { id: "petco-park", team: "San Diego Padres", stadiumName: "Petco Park", city: "San Diego", state: "CA", lat: 32.7076, lng: -117.157, opened: 2004, capacity: 40209, roofType: "Open Air", league: "NL", division: "NL West", funFacts: [
    "A real 1909 brick warehouse, the Western Metal Supply Co. building, was built right into the left-field corner — the foul pole actually runs up its side, and there are seats on its rooftop.",
    "The Park at the Park is a grassy hill beyond center field where families can spread out a blanket and watch the game picnic-style.",
    "Petco Park enjoys San Diego's famously mild weather, so it rarely needs to worry about rain delays or extreme heat.",
    "The ballpark is within walking distance of San Diego Bay and the historic Gaslamp Quarter."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Petco_Park_Interior.JPG",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:Petco_Park_Padres_Game.jpg"
  ], mapColor: "#2F241D", logoUrl: "assets/logos/petco-park.svg" },

  { id: "oracle-park", team: "San Francisco Giants", stadiumName: "Oracle Park", city: "San Francisco", state: "CA", lat: 37.7786, lng: -122.3893, opened: 2000, capacity: 41265, roofType: "Open Air", league: "NL", division: "NL West", funFacts: [
    "Oracle Park sits right on San Francisco Bay, and kayakers gather in 'McCovey Cove' beyond right field hoping to catch a splash-landing home run ball.",
    "The right-field wall is only 309 feet from home plate but stands 25 feet tall — inspired by Fenway's Green Monster — to keep that short distance from being too easy.",
    "A giant Coca-Cola bottle slide and an oversized baseball glove sculpture tower over the kids' play area beyond left field.",
    "The ballpark has had several names over the years — Pac Bell Park, SBC Park, AT&T Park — before becoming Oracle Park in 2019."
  ], imageUrls: [
    "https://en.wikipedia.org/wiki/Special:FilePath/File:AT&T_Park_July_24,_2016.jpg",
    "https://en.wikipedia.org/wiki/Special:FilePath/File:AT&T_Park,_San_Francisco_at_night.jpg"
  ], mapColor: "#FD5A1E", logoUrl: "assets/logos/oracle-park.svg" }
];
