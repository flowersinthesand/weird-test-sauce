describe("client", function() {
    describe("transport", function() {
        function suite() {
            it("done", function() {
            });
        }
        
        ["ws", "sse", "streamxhr", "streamxdr", "streamiframe", "longpollajax", "longpollxdr", "longpolljsonp"].forEach(function(transport) {
            describe(transport, function() {
                suite();
            });
        });
    });
})