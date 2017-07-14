import ejs from 'ejs';
import haml from 'haml';
import jade from 'jade';

export const htmlRender = (txt) => {
	return txt;
}

export const ejsRender = (txt, vars) => {
	try{
		return ejs.render(txt, vars);
	}catch(err){
		return txt;
	}	
}

export const jadeRender = (txt, vars) => {
	try{
		return jade.render(txt, vars);
	}catch(err){
		return txt;
	}	
}

export const hamlRender = (txt, vars) => {
	try{
		return haml.render(txt, vars);
	}catch(err){
		return txt;
	}	
}