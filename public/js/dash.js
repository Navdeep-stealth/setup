class Dash extends Base
{
    deleteData()
    {
        const self = this;
        const deleteBtns = document.getElementsByClassName( 'delete-item' );
        for ( const item of deleteBtns )
        {
            item.onclick = ( e ) =>
            {
                e.preventDefault();
                self.confirm( 'Do you want to continue', ( ok ) =>
                {
                    if ( ok )
                    {
                        // some ajax, use BASE.JAJAX
                        self.notify( 'SUCCESS', 'data has been deleted', 'success' );
                    }
                    else
                    {
                        self.notify( 'ABORT', 'action aborted by user', 'warning' );
                    }
                } );
            };
        }
    }
}

( () =>
{
    const dash = new Dash();
    dash.deleteData();
} )();