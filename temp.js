MMSI,IMO,NAME,CALLSIGN,TYPE,A,B,C,D,DRAUGHT,DEST,ETA



{ class: 'AIS',
  device: 'udp://192.168.1.76:5000',
  type: 5,
  repeat: 0,
  mmsi: 205204047,
  scaled: true,
  imo: 0,
  ais_version: 1,
  callsign: 'OT4047',
  shipname: 'SCHELDE',
  shiptype: 99,
  shiptype_text: 'Other Type - no additional information',
  to_bow: 18,
  to_stern: 22,
  to_port: 6,
  to_starboard: 6,
  epfd: 15,
  epfd_text: 'INVALID EPFD',
  eta: '04-18T00:00Z',
  draught: 0.3,
  destination: 'ANTW      LILLO-DOEL',
  dte: 0 }


db.serialize(function(){
db.run("INSERT INTO MESSAGES (MMSI,IMO,NAME,CALLSIGN,TYPE,A,B,C,D,DRAUGHT,DEST,ETA) VALUES (" 
	+ "'" + obj['mmsi'] + "'," 
	+ "'" + obj['imo'] + "'," 
	+ obj['shipname'] + 
	+ obj['callsign'] + 
	+ "'" + obj['shiptype'] + "'," 
	+ "'" + obj['to_bow'] + "'," 
	+ "'" + obj['to_stern'] + "'," 
	+ "'" + obj['to_port'] + "'," 
	+ "'" + obj['to_starboard'] + "'," 
	+ "'" + obj['draught'] + "'," 
	+ obj['destination'] + 
	+ obj['eta'] + 
	")");
})