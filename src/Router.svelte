<script>
    import page from "page.js";
    import { setContext, afterUpdate } from "svelte";
    import { current_path } from "./stores.js";
 
    //setContext("current_path", $current_path)
	function navigate(ctx, next) {
        console.log(`navigating to ${ctx.path}`)
        $current_path = ctx.path
	};

    let started = false;
    afterUpdate(() => {
        if (!started) {
            started = true;
            page("*", (ctx) => {
                console.log($current_path+' not found : '+ctx.path);
                $current_path = ctx.path;
                });
	        page.start({ hashbang: false });
        }
    });
</script>

<slot />