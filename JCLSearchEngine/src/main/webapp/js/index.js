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
			
			$('#centered').addClass('centered_res');
			$('#action_area').addClass('action_area_res');
			$('#logo_wrap').addClass('logo_wrap_res');
			$('#logo_txt').addClass('logo_txt_res');
			$('#search_form_homepage').addClass('search_form_homepage_res');
			$('#search_btn').addClass('search_btn_res');
			$('#result_area').addClass('result_area_res');
			$('#res_sum').addClass('res_sum_res');
			
			
			
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
			success		: function( r_data, r_textStatus, r_jqXHR )
			{
				var rif = $('#result_area').empty();
				$('#page_area').empty();
				$('#res_miss').removeClass();
				
				$('#res_sum .res_sum_l').eq(0).text( 'Ricerca eseguita in ' + ( r_data.took ) + ' msec' );
				//debugger;
				$('#res_sum .res_sum_r').eq(0).text( r_data.hits.total ? 'trovat' + ( r_data.hits.total > 1 ? 'i' : 'o' ) + ' ' + r_data.hits.total + ' element' + ( r_data.hits.total > 1 ? 'i' : 'o' ) : '' );
				
				if( r_data.suggest.did_you_mean[0].options[0] )
				{	
					$('#res_miss').addClass('res_miss_res');
					$('#res_miss').text('Forse intendevi: ' + r_data.suggest.did_you_mean[0].options[0].text + ' ?').click( function( e ){
						$('#search_form_input_homepage').val( r_data.suggest.did_you_mean[0].options[0].text );
						doSearch( r_data.suggest.did_you_mean[0].options[0].text );
					});
				}
				
				if( r_data.hits.total && r_data.hits.hits )
				{
					$.each( r_data.hits.hits, function( k, v )
					{	
						
						$('<a/>', {'class':'result_row', 'href':v._source.url, 'target':'_blank'}).append(
							$('<div/>', {'class':'res_title'}).text( v._source.title ),
							$('<div/>', {'class':'res_src'}).text( v._source.url ),
							$('<div/>', {'class':'res_txt'}).html( '[...]'+ v.highlight.content[0] )
						).appendTo( rif );
						
					});
					
					if( r_data.hits.total > 10 )
					{	
						var pages_num_dom = $('#page_area');
						var pages_num = Math.ceil( r_data.hits.total / 10 );
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
										success		: function( r_data_d, r_textStatus_d, r_jqXHR_d )
										{
											rif.empty();
											
											$('#res_sum .res_sum_l').eq(0).text( 'Ricerca eseguita in ' + ( r_data.took ) + ' msec' );
											
											$('#res_miss').text('');
											
											$.each( r_data_d.hits.hits, function( k, v )
													{	
														
														$('<a/>', {'class':'result_row', 'href':v._source.url, 'target':'_blank'}).append(
															$('<div/>', {'class':'res_title'}).text( v._source.title ),
															$('<div/>', {'class':'res_src'}).text( v._source.url ),
															$('<div/>', {'class':'res_txt'}).html( v.highlight.content[0] )
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

				}
				else
				{
					rif.append( $('<div/>', {'class':'res_empty'}).html( '<p>La ricerca di - ' + toSearch + ' - non ha prodotto risultati in nessun documento.</p>' ) );
				}
				
				$('#centered').addClass('centered_res');
				$('#action_area').addClass('action_area_res');
				$('#logo_wrap').addClass('logo_wrap_res');
				$('#logo_txt').addClass('logo_txt_res');
				$('#search_form_homepage').addClass('search_form_homepage_res');
				$('#search_btn').addClass('search_btn_res');
				$('#result_area').addClass('result_area_res');
				$('#res_sum').addClass('res_sum_res');
				$('#page_area').addClass('page_area_res');
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