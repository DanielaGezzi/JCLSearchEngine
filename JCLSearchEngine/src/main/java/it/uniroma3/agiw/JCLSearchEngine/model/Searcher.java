package it.uniroma3.agiw.JCLSearchEngine.model;

import java.io.UnsupportedEncodingException;
import java.net.InetAddress;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.suggest.phrase.DirectCandidateGenerator;
import org.elasticsearch.search.suggest.phrase.PhraseSuggestionBuilder;

public class Searcher {
	private String indexName = "agiw";
	private String clusterName = "elasticsearch";
	
	public Searcher(){
		super();
	}

	public SearchResponse search(String query, int page) throws UnsupportedEncodingException{
		
		Settings settings = Settings.settingsBuilder()
				.put("cluster.name", clusterName).build();
		Client client = TransportClient.builder()
				.settings(settings)
				.build();
		
		try{
			
			InetSocketTransportAddress inetSocketTransportAddress = 
					new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300);
			((TransportClient) client).addTransportAddress(inetSocketTransportAddress);
		
		}catch(Exception e){
			
			e.printStackTrace();
		}
		
		String encoded_query = new String(query.getBytes("UTF-8"), "UTF-8");

		PhraseSuggestionBuilder suggestion = new PhraseSuggestionBuilder("did_you_mean")
				.field("content")
				.text(query)
				.analyzer("simple")
				.highlight("<i>", "</i>")
				.gramSize(3);

		SearchResponse response = client.prepareSearch(indexName)
				.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
				.setQuery(QueryBuilders.multiMatchQuery(encoded_query, "content", "title"))
				.addHighlightedField("content")
				.setHighlighterOrder("score")
				.setHighlighterPreTags("<b>")
				.setHighlighterPostTags("</b>")
				.setHighlighterFragmentSize(120)
				.addSuggestion(suggestion)
				.setFrom((page-1)*10).setSize(10).setExplain(true)
				.execute()
				.actionGet();
		
		return response;

	}
	

}