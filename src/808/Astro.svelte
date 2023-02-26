<script>
    import { onMount, onDestroy } from 'svelte'
    let pname = new Array("Mercury", "Venus", "Sun", "Mars", "Jupiter", "Saturn ", "Uranus", "Neptune", "Pluto");
    //celestialBodies = 
    let planets = {
        sun: {color: "#F8E71C", relativeSize: 1, symbol: "☉"},
        mercury: {color: "#CAB19A", relativeSize: 0.3, symbol: "☿"},
        venus: {color: "#F2D798", relativeSize: 0.3, symbol: "♀"},
        earth: {color: "#40AED7", relativeSize: 0.4, symbol: "♁"},
        mars: {color: "#E9862E", relativeSize: 0.4, symbol: "♂"},
        jupiter: {color: "#E9B092", relativeSize: 0.9, symbol: "♃"},
        saturn: {color: "#FCDBB5", relativeSize: 0.8, symbol: "♄"},
        uranus: {color: "#56CDEA", relativeSize: 0.6, symbol: "⛢"},
        neptune: {color: "#1A88CE", relativeSize: 0.6, symbol: "♆"}
    }
    let calc = {
        year: "", month: "", day: "", hour: "", mins: "", secs: "",
        west : "", east: "", south: "", north: "", thisday: "",
        lat_degrees : "", lat_minutes: "", lon_degrees :  "", lon_minutes: "",
    };

    onMount( async() => {
		// will do await 
		// let res = await fetch(url)
		// res = await res.json()
		//$h808e = res.data
        //console.log(res)
        let res = "{'some random shit': 'you have'}"
	})

	onDestroy({
		// data must delete
	})
</script>

<section>
    <form name=calc>
        <table border=1 cellspacing=0 bordercolor=darkblue frame=border rules=rows>
            <caption>Enter your location:</caption>
            <tr><td>latitude</td><td>longitude</td></tr>
            <tr>
                <td><input size=10 maxLength=20 name=lat_degrees>&deg;</td>
                <td><input size=10 maxLength=20 name=lon_degrees>&deg;</td>
            </tr>
            <tr>
                <td><input size=10 maxLength=20 name=lat_minutes>' </td>
                <td><input size=10 maxLength=20 name=lon_minutes>' </td>
            </tr>
            <tr>
                <td><input type="radio" name ="north" onClick="north_lat();" checked>North</td>
                <td><input type="radio" name ="south" onClick="south_lat();">South</td>
            </tr>
            <tr>
                <td><input type="radio" name ="east" onClick="east_lon();">East</td>
            <td><input type="radio" name ="west" onClick="west_lon();" checked>West</td>
            </tr>
        </table>
        <p><b>today:</b> <input size=20 maxLength=20 name=thisday></p>
        <table border=1 cellspacing=0 bordercolor=darkblue frame=border rules=rows>
            <caption>Enter the date and time:<br> <tt>mm/dd/yyyy hr:min:sec</tt></caption>
            <tr>
                <td><input size=2 maxLength=10 name=month><b> / </b></td>
                <td><input size=2 maxLength=10 name=day><b> / </b></td>
                <td><input size=5 maxLength=10 name=year><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></td>
                <td><input size=2 maxLength=10 name=hour><b> : </b></td>
                <td><input size=2 maxLength=10 name=minute><b> : </b></td>
                <td><input size=2 maxLength=10 name=second></td>
            </tr>
        </table>
    </form>
<!-- <p><input onclick=compute(); type=button STYLE="font-family:Courier" value="Compute"></p> -->
<!-- <p><INPUT onclick=test(); type=button STYLE="font-family:Courier" value=" Test "></p> -->
</section>

<style>
</style>