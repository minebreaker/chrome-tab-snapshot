async function getAllWindows(): Promise<chrome.windows.Window[]> {
    return new Promise( resolve => {
        chrome.windows.getAll( resolve )
    } )
}

// windows.getAll doesn't return tabs object, need to manually query them.
async function getTabsOfWindow( windowId: number ): Promise<chrome.tabs.Tab[]> {
    return new Promise( resolve => {
        chrome.tabs.query( { windowId }, resolve )
    } )
}

chrome.browserAction.onClicked.addListener( async () => {

    const windows = await getAllWindows()
    const tabsOfWindows = await Promise.all( windows.map( w => getTabsOfWindow( w.id ) ) )
    const data = tabsOfWindows.map( w => w.map( tab => ({ id: tab.id, title: tab.title, url: tab.url }) ) )

    const w = window.open( "about:blank", "_blank" )
    if ( w ) {
        w.document.write( JSON.stringify( data ) )
    }
} )
