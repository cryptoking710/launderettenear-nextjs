// UK regions for grouping cities
export const UK_REGIONS = {
  "Greater London": ["London", "Croydon", "Sutton", "Bromley", "Wembley", "Twickenham", "Wimbledon", "Greenwich", "Woolwich", "Catford"],
  "South East England": ["Brighton", "Oxford", "Reading", "Portsmouth", "Southampton", "Canterbury", "Maidstone", "Hastings", "Guildford", "Slough", "Basingstoke", "Crawley", "Eastbourne", "Chatham", "Ashford", "Worthing", "Gillingham"],
  "South West England": ["Bristol", "Plymouth", "Exeter", "Bournemouth", "Swindon", "Gloucester", "Cheltenham", "Taunton", "Bath", "Torquay"],
  "East of England": ["Luton", "Cambridge", "Norwich", "Ipswich", "Peterborough", "Colchester", "Southend-on-Sea", "Chelmsford", "Watford", "Stevenage", "King's Lynn", "Great Yarmouth", "Lowestoft", "Wisbech"],
  "East Midlands": ["Leicester", "Nottingham", "Derby", "Northampton", "Lincoln", "Kettering", "Corby"],
  "West Midlands": ["Birmingham", "Coventry", "Wolverhampton", "Worcester", "Stoke-on-Trent"],
  "Yorkshire and the Humber": ["Leeds", "Sheffield", "Bradford", "Hull", "York", "Doncaster", "Rotherham", "Barnsley", "Huddersfield", "Wakefield", "Halifax"],
  "North West England": ["Manchester", "Liverpool", "Preston", "Blackpool", "Bolton", "Warrington", "Oldham", "Rochdale", "Blackburn", "Burnley", "Stockport", "Wigan", "St Helens", "Salford", "Chester"],
  "North East England": ["Newcastle upon Tyne", "Sunderland", "Durham", "Middlesbrough", "Hartlepool", "Darlington"],
  "Scotland": ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Inverness", "Perth", "Stirling", "Ayr", "Paisley", "Dumfries", "Kilmarnock", "Dunfermline", "Greenock", "Falkirk", "Kirkcaldy", "Motherwell", "Hamilton", "Livingston"],
  "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry", "Caerphilly", "Neath", "Port Talbot", "Bridgend", "Llanelli", "Merthyr Tydfil", "Rhondda"],
  "Northern Ireland": ["Belfast", "Londonderry", "Lisburn", "Newry", "Bangor", "Armagh"],
  "Cumbria": ["Carlisle", "Barrow-in-Furness"]
} as const;

export type Region = keyof typeof UK_REGIONS;
export type City = typeof UK_REGIONS[Region][number];
