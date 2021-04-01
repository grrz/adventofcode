========== day 8 2015

a.gsub! "\n", '';'a'
b = a.gsub /\\x\w\w/, 'X';'с'
c = b.gsub '\\"', 'Q';'b'
d = c.gsub '\\', 'S';'d'
e = d.gsub '"', '';'e'
a.size - e.size


========== day 7 2015

c = b.map { |s|
  r = s.match /(.*) -> (\w{1,2})/
  if (r)
    [r[2], r[1].split(' ')]
  else
    p "bad str: #{s}"
  end
}.to_h;1



def _val(h)
  return h.to_i if h.match /\d/
  if @v[h].nil?
    @v[h] = _eval @c[h]
  else
    @v[h]
  end
end

def _eval(v)
  p '_eval ' + v.join(' ')
  case v.size
    when 1
      _val(v[0])
    when 2
      if v[0] == 'NOT'
        ~ _val(v[1])
      else
        p 'bad operator: ' + v[0]
      end
    when 3
      _oper v
  end
end

def _oper(v)
  case v[1]
    when 'AND'
      _val(v[0]) & _val(v[2])
    when 'OR'
      _val(v[0]) | _val(v[2])
    when 'LSHIFT'
      _val(v[0]) << v[2].to_i
    when 'RSHIFT'
      _val(v[0]) >> v[2].to_i
    else
      p 'bad operator: ' + v[1]
  end
end


========= day 6 2015

    case r[1]
      when 'turn off'
        tof(r[2].to_i, r[3].to_i, r[4].to_i, r[5].to_i)
      when 'turn on'
        ton(r[2].to_i, r[3].to_i, r[4].to_i, r[5].to_i, 1)
      when 'toggle'
        ton(r[2].to_i, r[3].to_i, r[4].to_i, r[5].to_i, 2)
    end

@t = 0

def ton(ax, ay, bx, by, v)
  for ii in (ay..by)
    for i in (ax + ii * 1000..bx + ii * 1000)
      @t += v
      @m[i] = @m[i].nil? ? v : @m[i] + v
    end
  end
end

def tof(ax, ay, bx, by)
  for ii in (ay..by)
    for i in (ax + ii * 1000..bx + ii * 1000)
      next if @m[i].nil?
      if @m[i] > 0
        @t -= 1
        @m[i] -= 1
      end
    end
  end
end

def tog(ax, ay, bx, by)
  for ii in (ay..by)
    for i in (ax + ii * 1000..bx + ii * 1000)
      if @m[i].nil?
        @t += 1
        @m[i] = true
      else
        @t -= 1
        @m[i] = nil
      end
    end
  end
end

turn off 674,321 through 793,388
toggle 749,672 through 973,965
turn on 943,30 through 990,907