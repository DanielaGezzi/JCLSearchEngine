$(function(){

	function ShowError( id_str, jqXHR, textStatus, errorThrown )
	{
		console.log(
			'[ ' + id_str + ' ERROR CODE ] : '		+ jqXHR.status			+ '<br/>' +
			'[ ' + id_str + ' ERROR TXT ] : '		+ textStatus			+ '<br/>' +
			'[ ' + id_str + ' ERROR THROWN ] : '	+ errorThrown			+ '<br/>' +
			'[ ' + id_str + ' RESPONSE TXT ] : '	+ jqXHR.responseText
		);
	}
	
	$('body').on("click", "#logo_homepage_link",
		function( e )
		{
			console.log('clicked logo');
			
			$('#centered').addClass('centered_resfound');
			$('#action_area').addClass('action_area_resfound');
			$('#logo_wrap').addClass('logo_wrap_resfound');
			$('#logo_txt').addClass('logo_txt_resfound');
			$('#search_form_homepage').addClass('search_form_homepage_resfound');
			$('#search_btn').addClass('search_btn_resfound');
			$('#result_area').addClass('result_area_resfound');
			$('#res_sum').addClass('res_sum_resfound');
			
			
			
			e.preventDefault();
			e.stopPropagation();
		}
	);
	

	function doSearch( toSearch )
	{
		if( !toSearch || toSearch.length === 0 ) return;
				
		$.ajax({
			type		: 'POST',
			url			: '/JCLSearchEngine/doSearch',
			dataType	: 'json',
			data		:
			{
				'query'			: toSearch,
				'page'			: 1
			},
			success		: function( res_data, res_textStatus, res_jqXHR )
			{
				var rif = $('#result_area').empty();
				$('#res_sum .res_sum_l').eq(0).text( 'Ricerca eseguita in ' + ( res_data.took ) + ' msec' );
				$('#res_sum .res_sum_r').eq(0).text( res_data.hits.total ? 'trovat' + ( res_data.hits.total > 1 ? 'i' : 'o' ) + ' ' + res_data.hits.total + ' element' + ( res_data.hits.total > 1 ? 'i' : 'o' ) : '' );
				
				//if( res_data.suggest )
				//{
				//	$('#res_miss').text('Forse intendevi: ' + res_data.suggest.etc + ' ?').click( function( e ){
				//		$('#search_form_input_homepage').val( res_data.suggest.etc );
				//		doSearch( res_data.suggest.etc );
				//	});
				//}
				
				if( res_data.hits.total && res_data.hits.hits )
				{	
					$.each( res_data.hits.hits, function( k, v )
					{	
						
						$('<a/>', {'class':'result_row', 'href':v._source.url, 'target':'_blank'}).append(
							$('<div/>', {'class':'res_title'}).text( v._source.title ),
							$('<div/>', {'class':'res_src'}).text( v._source.url ),
							$('<div/>', {'class':'res_txt'}).text( v._source.content )
						).appendTo( rif );
						
					});
					
					if( res_data.hits.total > 10 )
					{
						var pages_num_dom = $('#page_area');
						var pages_num = Math.ceil( res_data.hits.total / 10 );
						for( var x = 0; x < pages_num; x++ )
						{
							pages_num_dom.append(
								$('<div/>',{'class':('page_num' + ( x == 0 ? ' selected_page' : '' ) ) }).text( x + 1 ).click( function( e )
								{
									$.ajax({
										type		: 'POST',
										url			: '/JCLSearchEngine/doSearch',
										dataType	: 'json',
										data		:
										{
											'query'			: toSearch,
											'page'			: parseInt( $(this).text() )
										},
										success		: function( res_data_d, res_textStatus_d, res_jqXHR_d )
										{
											rif.empty();
											
											$('#res_sum .res_sum_l').eq(0).text( 'Ricerca eseguita in ' + ( res_data.took ) + ' msec' );
											
											//$('#res_miss').text('');
											
											$.each( res_data.hits.hits, function( k, v )
													{	
														
														$('<a/>', {'class':'result_row', 'href':v._source.url, 'target':'_blank'}).append(
															$('<div/>', {'class':'res_title'}).text( v._source.title ),
															$('<div/>', {'class':'res_src'}).text( v._source.url ),
															$('<div/>', {'class':'res_txt'}).text( v._source.content )
														).appendTo( rif );
														
													});
											
											$('.selected_page').removeClass('selected_page');
											$(this).addClass('selected_page');
										},
										error		: function( jqXHR, textStatus, errorThrown  )
										{
											ShowError( 'SRC', jqXHR, textStatus, errorThrown );
										}
									});
								})
							);
						}
					}
					
					$('#centered').addClass('centered_resfound');
					$('#action_area').addClass('action_area_resfound');
					$('#logo_wrap').addClass('logo_wrap_resfound');
					$('#logo_txt').addClass('logo_txt_resfound');
					$('#search_form_homepage').addClass('search_form_homepage_resfound');
					$('#search_btn').addClass('search_btn_resfound');
					$('#result_area').addClass('result_area_resfound');
					$('#res_sum').addClass('res_sum_resfound');

				}
				else
				{
					rif.append( $('<div/>', {'class':'res_empty'}).html( '<p>La ricerca di - ' + toSearch + ' - non ha prodotto risultati in nessun documento.</p>' ) );
				}
			},
			error		: function( jqXHR, textStatus, errorThrown  )
			{
				ShowError( 'SRC', jqXHR, textStatus, errorThrown );
			}
		});
	}
	
	$("#search_form_input_homepage").keypress(
		function( e )
		{
			//console.log( e.which + " - " + e.keyCode );
			switch( e.keyCode )
			{
				case 13:	//enter
				{
					doSearch( $('#search_form_input_homepage').val() );
					
					e.preventDefault();
					e.stopPropagation();
					break;
				}
			}
		}
	);
	
	$(document).on("click", "#search_btn",
		function( e )
		{
			doSearch( $('#search_form_input_homepage').val() );
			
			e.preventDefault();
			e.stopPropagation();
		}
	);

	$(document).ready(
		function( e )
		{
			console.log('ready');
		}
	);
	
});