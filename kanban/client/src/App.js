import  React,  {useEffect,  useState}  from 'react'  
import KanbanBoard from './kanbanboard';

function App(){

 return  (
   <div>
  <header className="bg-blue-500 py-4">
        <h1 className="text-white text-3xl font-bold text-center">Kanban Board</h1>
      </header>
      <KanbanBoard />
   </div>
 )
}
export default  App
