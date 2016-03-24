**lxf2xml**

This was an attempt at converting a Lego Digital Designer LXF file to Bricklink XML wanted list format in Javascript. It kinda works (read: it outputs valid Bricklink XML) *but*, as outlined in [this Eurobricks thread](http://www.eurobricks.com/forum/index.php?showtopic=65729), there are a lot of problems with doing this, including:

- Converting Lego IDs to Bricklink IDs which are constantly changing (`ldd2bl.js` does this, but it's copied [from here](http://www.peeron.com/inv/colors), which is not up-to-date)
- Bricklink won't accept [alternate item numbers](https://www.bricklink.com/help.asp?helpID=1562) when uploading, many of which LDD uses