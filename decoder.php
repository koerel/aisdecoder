//code to decode ais messages
/*
? Receives a broadcast message,
? Organises the binary bits of the Message Data into 6-bit strings,
? Converts the 6-bit strings into their representative "valid characters" – see IEC 61162-1,
table 7,
? Assembles the valid characters into an encapsulation string, and
? Transfers the encapsulation string using the VDM sentence formatter.

sample message
!AIVDM,1,1,,A,1P000Oh1IT1svTP2r:43grwb0Eq4,0*01

*/
<?php

$ais = "1P000Oh1IT1svTP2r:43grwb0Eq4";
$aisdata168=NULL;//six bit array of ascii characters
$ais_nmea_array = str_split($ais);
foreach ($ais_nmea_array as $value) 
{
$dec=ascii_2_dec($value);
$bit8=asciidec_2_8bit($dec);
$bit6=dec_2_6bit($bit8);
echo $value ."-" .$bit6 ."
";
$aisdata168 .=$bit6;
}
echo $aisdata168 . "
";

echo "mmsi= " . bindec(substr($aisdata168,9,29)) . "
";
echo "cog= " . bindec(substr($aisdata168,116,12))/10 . "
";
echo "sog= " . bindec(substr($aisdata168,50,10))/10 . "
";

function ascii_2_dec($chr)
{
$dec=ord($chr);//get decimal ascii code
$hex=dechex($dec);//convert decimal to hex
return ($dec);
}

function asciidec_2_8bit($ascii)
{
if ($ascii) else
{
if($ascii>119){}
else
{
if($ascii>87 && $ascii else
{
$ascii=$ascii+40;
if ($ascii>128){$ascii=$ascii+32;}
else{$ascii=$ascii+40;}
}
}
}
return ($ascii);
}
function dec_2_6bit($dec)
{
$bin=decbin($dec);
return(substr($bin, -6)); 
}