doubles = ["733","945","1021C","328","337","381","467","634","635","729","732","741A","776","778","846","871","878","921B","931","933","966","1032","1039","1064","1066","1072","224A","225","228","252","321","322B","324","326","329","340A","344","371","379A","421C","422B","424A","428","433","438","446","451","464","472","521C","522B","524","533","537","553","572B","575","624A","627","645B","650","652","664","675","721","724","738B","780","821","832","833","840","866","921C","922C","932","940","971","978","1021D","1022B","1036","1040","1052A","1078B","322C","340B","341","440","548","824","924","939","941"]
singles = ["535","875","244C","327","330","429","450","476","628","631D","638","667","938","946","975","1021A","1043","1046","1075","224B","229","244B","345","374","375","376","377","380","421B","422C","424B","426","448","466","474","475","477","478","479A","521B","522C","526","532","534","538","539","543","544","545","549A","550","551","552","564","565","566","569","570","571","572A","573","574","577","578B","578A","625","629","631C","632","633","636","637","639","640","643","644","645A","647","648","649","670","672","673","674","678","725","727","730","738C","739","741B","743","744","746","747","748B","748C","775","825","839","865","872","873","874","922D","925","936","972","974","976","977","979","1022C","1025","1031C","1031B","1033","1034","1038","1044","1045","1052B","1065","1073","1074","1076","1077","1078A","322D","325","372","373","378","379B","427","447","452","465","473","479B","525","527C","540","549B","624B","626","631B","653","665","728","731","740","779","973"]
allRooms = singles.concat(doubles);
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};


$('.typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 2,

},
{
  name: 'rooms',
  source: substringMatcher(allRooms)
});


function changeRoom() {
    room = $('#roomNum').first().val();
    console.log(room);

    if (!~allRooms.indexOf(room)) {
        alert("Room: " + room + " not found :(");
        return
    }

    type = ~singles.indexOf(room) ? "single" : "double"

    setRoom(room, type);

}

$('.typeahead').change(changeRoom);
$('.typeahead').on('typeahead:select', changeRoom);
