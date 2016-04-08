package it.uniroma3.agiw.JCLSearchEngine.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.elasticsearch.action.search.SearchResponse;

/**
 * Servlet implementation class doSearch
 * 
 * @author JavaComeLava
 * 
 */

@WebServlet("/doSearch")
public class doSearch extends HttpServlet{
	
	private static final long serialVersionUID = 1L;

	/**
     * @see HttpServlet#HttpServlet()
     */
    public doSearch() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    /**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String query			  	= request.getParameter("query");
		Integer page				= Integer.parseInt( request.getParameter("page") );
		SearchResponse search_res 	= null;
		
		/* Imposto la pagina di default ad 1 */
		if(page == 0) {
			page = 1;
		}
		
		try
		{
			SearchFacade facade = new SearchFacade();
			search_res	= facade.search(query, page);
			System.out.println(search_res);
			
		}
		catch( Exception e ){
			e.printStackTrace();;
		}
		
       response.setContentType("application/json; charset=utf-8");
       response.getWriter().write(search_res.toString());		
	}
}


