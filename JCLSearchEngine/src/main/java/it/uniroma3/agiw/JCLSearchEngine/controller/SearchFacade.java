package it.uniroma3.agiw.JCLSearchEngine.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.elasticsearch.action.search.SearchResponse;

import it.uniroma3.agiw.JCLSearchEngine.model.Searcher;

/**
 * Facade per la ricerca nell'indice
 * 
 * @author JavaComeLava
 *
 */

public class SearchFacade {

	public SearchResponse search(String query, int page) throws IOException {
		/* Richiamo la classe che si occupa della ricerca */
		Searcher searcher = new Searcher();
		
		try {
			return searcher.search(query, page);
		
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}

}
