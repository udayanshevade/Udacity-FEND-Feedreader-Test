/*
 * feedreader.js
 *
 */

/*
 * Ensures that the DOM is ready at the time of testing.
 */
$(function() {

    /*
     * 1st TEST SUITE for RSS feeds, and the allFeeds object
     */
    describe('RSS Feeds', function() {
        var allFeedsLength;

        // helper fn to check every url in allFeeds
        function checkURL(element, index, array) {
            return (typeof element.url === 'string' && element !== '');
        }

        // checks every name element in allFeeds to see if it has a name
        function checkName(element, index, array) {
            return (typeof element.name === 'string' && element !== '');
        }

        // Tests length of allFeeds to be greater than 0
        it('are defined', function() {
            allFeedsLength = allFeeds.length;
            expect(allFeedsLength).not.toEqual(0);
        });


        /* Tests each feed in the allFeeds object and ensures
         * each has a defined URL and the URL is non-empty
         */
        it('have non-empty URLs', function() {

            // find checkURL() defined in app.js
            expect(allFeeds.every(checkURL)).toBe(true);
        });

        /* Tests each feed in the allFeeds object and ensures
         * each has a name defined and the name is not empty
         */
         it('have non-empty names', function() {

            // find checkName() defined in app.js
            expect(allFeeds.every(checkName)).toBe(true);
         });
    });




    /*
     * 2nd TEST SUITE for the menu functionality
     */
    describe('The menu', function(){
        var $body;
        var $menuIcon;
        var isMenuHidden;


        // Assigns necessary variables before each test
        beforeEach(function() {
            $body = $('body');
            $menuIcon = $('.menu-icon-link');
            // boolean test for whether menu has the '.hidden' class
            isMenuHidden = $body.hasClass('menu-hidden');
        });


        // Checks if menu is hidden on start
        it('is hidden by default', function() {
            expect(isMenuHidden).toBe(true);
        });


        /*
         * NESTED TEST SUITE to check click results
         */
        describe('once clicked', function() {
            // returns status of menu visibility
            function checkMenuVisibility(classStatus) {
                var visibility = classStatus ? 'open' : 'closed';
                return visibility;
            }

            beforeEach(function() {

                // simulate menu click
                $menuIcon.click();
            });

            // Checks if the menu opens from it default closed state.
            it('opens if closed', function() {

                // find checkMenuVisibility() defined in app.js
                expect(checkMenuVisibility(isMenuHidden)).toBe('open');

                // console.log(checkMenuVisibility(isMenuHidden));
            });

            // Checks if the menu closes from the open state.
            it('closes if open', function() {

                // returns 'open' or 'closed' based on trueness
                expect(checkMenuVisibility(isMenuHidden)).toBe('closed');

                // console.log(checkMenuVisibility(isMenuHidden));
            });
        });

    });

    /*
     * 3rd TEST SUITE for Initial Entries
     */
    describe('Initial Entries', function() {
        var randomFeed;
        var entriesLength;

        beforeEach(function(done) {

            // Loads the first feed.
            loadFeed(0, done);

            // Selects its data from the allFeeds object.
            randomFeed = allFeeds[0];
        });

        /* Checks that execution and completion of loadFeed
         * creates at least one '.entry' element in the '.feed' container.
         */
        it('include at least one .entry element', function(done) {

            // Stores the length of entries returned by jQuery.
            entriesLength = $('.feed .entry').length;

            // Expects its length to be greater than 0.
            expect(entriesLength).toBeGreaterThan(0);

            // console.log(entriesLength);

            done();
        });


        /* ### ADDITIONAL TEST No. 1 ###
         * -----------------------------
         * Checks the initial read/unread status of entries.
         */
        it('begin as unread', function(done) {

            // Reads the initial status of sample loaded feed.
            expect(randomFeed.entries[1].status).toEqual('unread');
            done();
        });

        /* ### ADDITIONAL TEST No. 2 ###
         * -----------------------------
         * Verifies that visited links get registered as 'read'.
         */
        it('get flagged as read if clicked', function(done) {
            // click chosen sample feed
            $('.entry-link')[1].click();
            // read status of the entry after clicked
            expect(randomFeed.entries[1].status).toEqual('read');
            done();
        });
    });

    /* Checks that a new feed is loaded by loadFeed
     * and that the content actually changes.
     */
    describe('New Feed Selection', function() {
        var $content;
        var $changedContent;
        var prevContent;
        var refreshSpy;

        beforeEach(function(done) {

            // Loads the first feed.
            loadFeed(0, function() {

                // Sample some text from the feed
                $content = $('.entry > h2').text();
                done();
            });
        });

        // Checks if the loaded content is actually different.
        it('changes content', function(done) {

            // Loads the next feed.
            loadFeed(1, function() {

                // Caches the content of the feed.
                $changedContent = $('.entry > h2').text();

                // Checks if the new content matches the old.
                expect($changedContent).not.toEqual($content);

                // console.log($content + '<<<<====>>>>' $changedContent);
                done();
            });
        });

        /* ### ADDITIONAL TEST No. 3 ###
         * -----------------------------
         * Checks if content changes when loadNextFeed is called.
         */
        it('loads next feed when loadNextFeed is called', function(done) {

            // Loads the next feed.
            loadNextFeed(function() {

                // Caches the new content.
                $changedContent = $('.entry > h2').text();

                // Compares the two samples.
                expect($changedContent).not.toEqual($content);

                // console.log($content + '<<<<====>>>>' $changedContent);
                done();
            });
        });

        /* ### ADDITIONAL TEST No. 4 ###
         * -----------------------------
         * Checks if content changes when loadPreviousFeed is called.
         */
        it('loads previous when loadPreviousFeed is called', function(done) {

            // Loads next feed.
            loadPreviousFeed(function() {

                // Caches the new content again.
                $changedContent = $('.entry > h2').text();

                // Compares the results.
                expect($changedContent).not.toEqual($content);

                // console.log($content + '<<<<====>>>>' $changedContent);
                done();
            });
        });

        // NESTED TEST SUITE for the arrow navigation buttons
        describe('Arrows', function(done) {

            /* ### ADDITIONAL TEST No. 5 ###
             * -----------------------------
             * Spies on loadNextFeed to see if clicking the #next-arrow
             * actually triggers the requisite function.
             */
            it('use loadNextFeed when using next arrow', function(done) {

                // Sets up the spy on window.loadNextFeed
                spyOn(window, 'loadNextFeed');

                // Simulates the #next-arrow click.
                $('#next-arrow').click();

                // Checks if window.loadNextFeed has been called.
                expect(window.loadNextFeed).toHaveBeenCalled();

                // console.log(window.loadNextFeed.calls.count());
                done();
            });

            /* ### ADDITIONAL TEST No. 6 ###
             * -----------------------------
             * Spies on loadPreviousFeed to see if clicking the #back-arrow
             * actually triggers the requisite function.
             */
            it('use loadPreviousFeed when using back arrow', function(done) {

                // Sets up the spy on window.loadPreviousFeed
                spyOn(window, 'loadPreviousFeed');

                // Simulates the #back-arrow click.
                $('#back-arrow').click();

                // Checks if window.loadPreviousFeed has been called.
                expect(window.loadPreviousFeed).toHaveBeenCalled();

                // console.log(window.loadPreviousFeed.calls.count());
                done();
            });
        });

        it('reloads when the reload button is pressed', function(done) {

            // Create spy for window.loadFeed
            refreshSpy = spyOn(window, 'loadFeed');

            // console.log(currentID);

            // Simulate refresh click
            $('#refresh').click();

            // Checks if loadFeed has been called.
            expect(refreshSpy.calls.mostRecent().args[0]).toEqual(0);
            done();
        });

    });


    /*
     * 4th TEST SUITE for Inactivity
     */
    describe('Inactivity', function() {

        beforeEach(function() {

            // Clears existing interval to prevent double calls.
            clearInterval(inactivity);

            // Creates spy to track loadFeed.
            spyOn(window, 'loadFeed');

            // Installs clock for interval testing.
            jasmine.clock().install();
        });


        /* ### ADDITIONAL TEST No. 7 ###
         * -----------------------------
         * Spies on loadFeed to see if it cycles properly
         * on a given fixed interval.
         */
        it('causes feeds to cycle', function() {

            // Redefines the 'inactivity' interval.
            inactivity = setInterval(function() {
                loadFeed(0);
            }, 15000);

            // Clicks mock clock ahead to 4 cycles.
            jasmine.clock().tick(60000);

            // console.log(window.loadFeed.calls.count());

            // Verifies that loadFeed has been called 4 times.
            expect(window.loadFeed.calls.count()).toEqual(4);
        });

        afterEach(function() {

            // Restores original timer functions.
            jasmine.clock().uninstall();
            clearInterval(inactivity);
            loadFeed(0);
        });

    });



    /*
     * 5th TEST SUITE for Transitions
     */
    describe('Transitions', function() {

        beforeEach(function(done) {

            // Spies on the jQuery animation fxn .show()
            spyOn($.fn, 'show');

            // Loads sample feed.
            loadFeed(1, done);
        });

        /* ### ADDITIONAL TEST No. 8 ###
         * -----------------------------
         * Verifies that $.fn.show has been called
         */
        it('are animated between changing feeds', function(done) {

            // Checks if $.fn.show has been called
            expect($.fn.show).toHaveBeenCalled();

            // console.log($.fn.show.calls.count());
            done();
        });
    });

    /*
     * 6th TEST SUITE for Favoriting
     */
    describe('Favorites', function() {
        var favoritesContainer;
        var $content;
        var $changedContent;
        var status;
        var changedStatus;

        beforeEach(function() {

            // Accesses the favorites list
            favoritesContainer = $('.favorite-list');

            // Looks up the favorited content.
            $content = favoritesContainer.text();

            // Records the current status.
            status = allFeeds[0].favoriteStatus;
        });

        afterAll(function() {
            $('.favorite-list>li:first-child>.subtract-option').click();
        });

        // Checks that the add favorite button works as expected
        describe('are added', function() {
            var $addFirst = $('.feed-list>li:first-child>.favorite-option');

            beforeEach(function() {
                // Clicks the add-button for a sample feed.
                $addFirst.click();
            });

            /* ### ADDITIONAL TEST No. 9 ###
             * -----------------------------
             * Verifies that a feed can be favorited.
             */
            it('with the add-favorite button', function() {
                $changedContent = favoritesContainer.text();

                // Checks if favorites list has changed.
                expect($changedContent).not.toEqual($content);
                changedStatus = allFeeds[0].favoriteStatus;

                // Checks if status of relevant feed has changed.
                expect(changedStatus).not.toEqual(status);
            });

            /* ### ADDITIONAL TEST No. 10 ###
             * -----------------------------
             * Verifies that a feed can only be favorited once.
             */
            it('only when they aren\'t already favorited', function() {
                $content = favoritesContainer.text();

                // Attempts favoriting the same feed again.
                $addFirst.click();
                $changedContent = favoritesContainer.text();

                // Compares to first change in content.
                expect($changedContent).toEqual($content);
            });
        });


        /* ### ADDITIONAL TEST No. 11 ###
         * -----------------------------
         * Verifies that favorited feeds can be unfavorited
         */
        it('can be removed with the remove-favorite button', function() {

            // Clicks the remove favorite feed button.
            $('.favorite-list>li:first-child>.subtract-option').click();
            $changedContent = favoritesContainer.text();

            // Expects favorite list to become empty.
            expect($changedContent).not.toEqual($content);
            changedStatus = allFeeds[0].favoriteStatus;
            expect(changedStatus).not.toEqual(status);
        });

        /* ### ADDITIONAL TEST No. 12 ###
         * -----------------------------
         * Verifies that the add-current button works the same as
         * the add-favorite button, but for the currently displayed feed.
         */
        it('can be added with the add-current button', function() {

            // Clicks the add-current button.
            $('#add-current').click();
            $changedContent = favoritesContainer.text();
            status = allFeeds[currentID].favoriteStatus;

            // Same tests as above.
            expect($changedContent).not.toEqual($content);
            expect(changedStatus).not.toEqual(status);
        });
    });

}());
