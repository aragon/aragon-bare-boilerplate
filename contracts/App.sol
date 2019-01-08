pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract App is AragonApp {
    ////
    ////               ....
    ////           .,,,,..,,,,.
    ////       ..,,.. ..     .,,,..
    ////     .,,.  ..,:....,,..  .,,.
    ////    ,:   ...,.    .,,..,.   :,
    ////    .:. ,. ,           ,.. .:.
    ////     ,:,.  ..        .,,., :,
    ////      ,;.   ........,..,..:,
    ////       ,:.       .. .....:,
    ////        .:,           .::.
    ////          .,,.      .,,.
    ////            .,,,..,,,.
    ////               ....
    ////
    ////  Build something beautiful.
    function initialize() public onlyInit {
        initialized();
    }
}
